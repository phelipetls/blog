---
title: "Getting Salesforce reports with VBA"
date: 2020-08-05
tags: ["salesforce", "vba", "excel"]
---

For those who find themselves in an environment which heavily relies on Excel
and Salesforce, you may be interested in a way to automate the process of
downloading reports from inside Excel with VBA only.

I think there are probably better tools for the job, like Apex, SOQL query or a
better programming language. I
[created a Python package for this purpose](https://github.com/reportforce) but
I didn't use it so much because it's hard to integrate with Excel.

Instead, I looked into a way to do something similar with VBA and I managed to
do it. In this post I'll share this with you.

# Authentication

The more painless way I know of to
[authenticate your requests for a Salesforce web service is via SOAP API](https://developer.salesforce.com/docs/atlas.en-us.api_asynch.meta/api_asynch/asynch_api_quickstart_login.htm),
with username, password and a security token.

It returns a bunch of XML in the response, but we will only need the session id
(a JWT) inside of it. This is what the function below does.

From here onwards, we will need to authenticate every request by passing the
header `Authorization: Bearer $sessionId`.

```vb
Function SalesforceLogin(Username As String, _
                         Password As String, _
                         SecurityToken As String) As String

    Dim Request As Object
    Set Request = CreateObject("MSXML2.XMLHTTP.6.0")

    Dim XMLBody As Object
    Dim XMLResponse As Object

    Set XMLBody = CreateObject("MSXML2.DOMDocument.6.0")
    Set XMLResponse = CreateObject("MSXML2.DOMDocument.6.0")

    Dim Url As String
    Dim Body As String
    Dim Response As String

    Url = "https://login.salesforce.com/services/Soap/u/47.0"

    Body = "<?xml version=""1.0"" encoding=""utf-8"" ?>" & vbNewLine & _
           "<env:Envelope xmlns:xsd=""http://www.w3.org/2001/XMLSchema""" & vbNewLine & _
           "    xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance""" & vbNewLine & _
           "    xmlns:env=""http://schemas.xmlsoap.org/soap/envelope/"">" & vbNewLine & _
           "  <env:Body>" & vbNewLine & _
           "    <n1:login xmlns:n1=""urn:partner.soap.sforce.com"">" & vbNewLine & _
           "      <n1:username>" & Username & "</n1:username>" & vbNewLine & _
           "      <n1:password>" & Password & SecurityToken & "</n1:password>" & vbNewLine & _
           "    </n1:login>" & vbNewLine & _
           "  </env:Body>" & vbNewLine & _
           "</env:Envelope>"

    XMLBody.LoadXML Body

    Request.Open "POST", Url, False
    Request.setRequestHeader "Content-Type", "text/xml"
    Request.setRequestHeader "SOAPAction", "login"
    Request.send XMLBody.XML
    Response = Request.responseText

    XMLResponse.LoadXML Response
    XMLResponse.setProperty "SelectionNamespaces", "xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:urn=""urn:partner.soap.sforce.com"""

    Dim SessionId As String
    SessionId = XMLResponse.SelectSingleNode("//urn:result/urn:sessionId").Text

    SalesforceLogin = SessionId

    Set Request = Nothing

End Function
```

# Parsing JSON inside VBA?

Now, to get an actual report inside Excel we will need to use the Analytics API.
So far, we didn't had to rely on any external tools, there is an XML parser
inside VBA, but not a JSON parser at least that I know of. So we're in trouble
here because that's what Analytics speaks.

Fortunately, there is a
[JSON parser implementation for VBA](https://github.com/VBA-tools/VBA-JSON)
which works flawlessly. You just need to download
[this file](https://raw.githubusercontent.com/VBA-tools/VBA-JSON/master/JsonConverter.bas)
and import it as a module.

# Unfortunate API limitations

This API unfortunately have a
[critical limitation](https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_limits_limitations.htm),
which is to return only a maximum of 2000 rows per report. Also, there is no way
to filter by row limits.

This almost turns it useless. The only way I know of is to use a column which
has only unique values and exclude already seen values with a filter, which is
what we'll gonna do.

# Getting report metadata

To be able to filter a report, we will need to fetch its metadata, which is a
huge JSON with key-value pairs describing the report.

We can get it with a `GET` request to
`https://$YOUR_INSTANCE_URL/services/data/v47.0/analytics/reports/$REPORT_ID/describe`.

```vb
Function GetMetadata(ReportId As String, SessionId As String) As String
    Dim Request As Object
    Set Request = CreateObject("MSXML2.XMLHTTP.6.0")
    Dim Response As String
    Dim Url As String

    ' NOTE: You will need your organization URL here
    Url =  YOUR_INSTANCE_URL & "/services/data/v47.0/analytics/reports/" & ReportId & "/describe"

    Request.Open "GET", Url, False
    Request.setRequestHeader "Authorization", "Bearer " & SessionId
    Request.send

    GetMetadata = Request.responseText
End Function
```

# Getting an individual report

With the function below, you will be able to get the report in JSON format.

This is achieved with a `POST` request to
`https://$YOUR_INSTANCE_URL/services/data/v47.0/analytics/reports/$REPORT_ID`,
optional metadata goes into the request body, this is what we use to filter the
report.

```vb
Function GetReport(ReportId As String, _
                   SessionId As String, _
                   Optional Metadata As String = "") As String

    Dim Request As Object
    Set Request = CreateObject("MSXML2.XMLHTTP.6.0")

    Dim Response As String
    Dim Url As String

    Url = YOUR_INSTANCE_URL & _
          "services/data/v47.0/analytics/reports/" & ReportId

    Request.Open "POST", Url, False
    Request.setRequestHeader "Authorization", "Bearer " & SessionId
    Request.setRequestHeader "Content-Type", "application/json"

    If Metadata <> "" Then
        Request.send (Metadata)
    Else
        Request.send
    End If

    Response = Request.responseText

    GetReport = Response
End Function
```

# Writing the data into a worksheet

Now we need to extract the data and write it into a worksheet.

[Every thing we need is inside the `factMap` key](https://developer.salesforce.com/docs/atlas.en-us.api_analytics.meta/api_analytics/sforce_analytics_rest_api_factmap_example.htm "Salesforce documentation on how to decode the factMap").
This can get complex if we intend to cover matrix and summary reports, which has
groupings etc., but tabular reports are much simpler.

What we need to do is to iterate through the values at `factMap.T!T.rows` and,
for each row, get every value inside `.dataCells` array.

This approach will only cover tabular reports, you can take a look at the
[reportforce source code](https://github.com/phelipetls/reportforce/tree/master/reportforce/helpers "Source code for reportforce package on a Github repository")
if you need to cover these. By the way, there is an option to export to an Excel
(but not to write to a worksheet, obviously).

The below function takes care of this, its job is to go through every cell and
store it in an array, and then append that array to a worksheet range starting
from column A.

```vb
Function WriteIntoWorksheet(Report As Dictionary, _
                            WorksheetName As String, _
                            ColumnLabels As Variant) As Variant

    Dim Rows As Object
    Dim Columns As Object
    Dim ColumnInfo

    Set Columns = Report("reportMetadata")("detailColumns")
    Set ColumnInfo = Report("reportExtendedMetadata")("detailColumnInfo")
    Set Rows = Report("factMap")("T!T")("rows")

    Dim Total_Rows As Long: Total_Rows = Rows.Count
    Dim Total_Columns As Long: Total_Columns = Columns.Count

    If Total_Rows = 0 Then
        Exit Function
    End If

    Dim Table() As Variant
    ReDim Table(Total_Rows - 1, Total_Columns - 1)

    Dim row As Variant
    Dim cell As Variant

    Dim i As Long: i = 0
    Dim j As Long
    Dim dataType As String

    For Each row In Rows
        j = 0
        For Each cell In row("dataCells")
            dataType = ColumnInfo(Columns(j + 1))("dataType")

            ' If column is a date, get value property;
            ' Excel understands it better
            If dataType = "date" Then
                Table(i, j) = cell("value")
            Else
                Table(i, j) = cell("label")
            End If

            j = j + 1
        Next cell
        i = i + 1
    Next row

    With ThisWorkbook.Worksheets(WorksheetName)
        Dim LastRow As Long
        LastRow = .Range("A:A").Find("*", _
                                     SearchOrder:=xlByRows, _
                                     SearchDirection:=xlPrevious).row

        .Range(.Cells(LastRow + 1, "A"), _
               .Cells(Total_Rows + LastRow, Total_Columns)) = Table
    End With

    WriteIntoWorksheet = Table

End Function
```

We also need to get the values at `.reportMetadata.detailColumns` and
`reportExtendedMetadata.detailColumnInfo` to check how many columns the report
have and to extract the value at `.value` if it is a date.

# Getting the entire report

To get the entire report, the key thing to overcome the API limitations is a key
called `.allData`, which will be `true` only if we got all the data from the
API.

So we get the first 2000 rows and, if `.allData` is `false`, we get the values
of an identifier column, filter them out and request a new report, until we get
all data.

We will modify the keys `.reportMetadata.standardDateFilter` and
`.reportMetadata.reportFilters`, to filter dates and other filters respectively.

If your report has a boolean filter, it's likely that you'll need to change it
because we will insert new filters. This is already done in the code by changing
the value at `.reportMetadata.reportBooleanFilter`, so you only need to pass it
as a parameter.

The function looks way more involved because we have to get the report headers
(the `label` property of each object inside
`.reportExtendedMetadata.detailColumnInfo`, the ones you see in the browser).

We also need the identifier column API name (an internal value), which we will
need to filter it.

```vb
Sub DownloadEntireReport(ReportId As String, _
                         WorksheetName As String, _
                         SessionId As String, _
                         Optional IdentifierColumn As String = "", _
                         Optional BooleanFilter As String = "", _
                         Optional startDate As String = "", _
                         Optional endDate As String = "")

    Dim Report As Object

    Dim ReportMetadata As Object
    Set ReportMetadata = JsonConverter.ParseJson(GetMetadata(ReportId, SessionId))

    Dim IdentifierColumnApiName As String
    Dim IdentifierColumnPosition As Long

    Dim Col As Variant
    Dim i As Long: i = 0

    Dim ColumnDetails As Object
    Set ColumnDetails = ReportMetadata("reportExtendedMetadata")("detailColumnInfo")

    ' This is an array to store the column headers
    Dim ColumnLabels() As Variant
    ReDim ColumnLabels(0, ColumnDetails.Count - 1)

    ' Collection the column headers
    For Each Col In ColumnDetails.Keys()
        ColumnLabels(0, i) = ColumnDetails(Col)("label")

        ' Remember which column matches the identifier column label
        If ColumnDetails(Col)("label") = IdentifierColumn Then
            IdentifierColumnApiName = Col
            IdentifierColumnPosition = i
        End If

        i = i + 1
    Next Col

    ' Write column headers starting from A1
    With ThisWorkbook.Worksheets(WorksheetName)
        .Range(.Cells(1, "A"), .Cells(1, ColumnDetails.Count)) = ColumnLabels
    End With

    Dim ReportMetadataJson As String: ReportMetadataJson = ""

    ' Setting date filters, if any
    If startDate <> "" And endDate <> "" Then
        ReportMetadata("reportMetadata")("standardDateFilter")("durationValue") = "CUSTOM"
        ReportMetadata("reportMetadata")("standardDateFilter")("startDate") = Format(startDate, "yyyy-mm-dd")
        ReportMetadata("reportMetadata")("standardDateFilter")("endDate") = Format(endDate, "yyyy-mm-dd")

        ReportMetadataJson = JsonConverter.ConvertToJson(ReportMetadata)
    End If

    ' Get first 2000 rows
    Set Report = JsonConverter.ParseJson(GetReport(ReportId, SessionId, ReportMetadataJson))

    Dim ReportTable As Variant
    ReportTable = WriteIntoWorksheet(Report, WorksheetName, ColumnLabels)

    ' Getting Remaining Values By Filtering Out Old Values

    If BooleanFilter <> "" Then
        ReportMetadata("reportMetadata")("reportBooleanFilter") = BooleanFilter
    End If

    Dim IdentifierColumnValues
    Dim IdentifierColumnFilter As String: IdentifierColumnFilter = ""

    Dim Filters As Scripting.Dictionary
    Set Filters = New Dictionary

    Dim ReportFilters As Object

    Do Until Report("allData")
        IdentifierColumnValues = GetValuesAtColumn(ReportTable, IdentifierColumnPosition)
        IdentifierColumnFilter = IdentifierColumnFilter & _
                                 Join(Application.Transpose(IdentifierColumnValues), ",")

        Filters.RemoveAll
        Filters.Add "filterType", "fieldValue"
        Filters.Add "isRunPageEditable", True
        Filters.Add "column", IdentifierColumnApiName
        Filters.Add "operator", "notEqual"
        Filters.Add "value", IdentifierColumnFilter

        Set ReportFilters = ReportMetadata("reportMetadata")("reportFilters")

        ' If IdentifierColumn was already added, just change the filter value
        If ReportFilters(ReportFilters.Count)("column") = IdentifierColumn Then
            ReportFilters(ReportFilters.Count)("value") = IdentifierColumnFilter
        Else
            ReportFilters.Add Filters
        End If

        ReportMetadataJson = JsonConverter.ConvertToJson(ReportMetadata)

        Set Report = JsonConverter.ParseJson(GetReport(ReportId, SessionId, ReportMetadataJson))

        ReportTable = WriteIntoWorksheet(Report, WorksheetName, "")
    Loop

End Sub
```

To do the filter, we create a `Filters` dictionary to store all key-value pairs
we need, then add it to the `reportFilters` object, and change its value in
later iterations. Then we convert the metadata into a JSON string, get a new
filtered report and repeat the loop until we get all data.

Also notice that I use a custom function to get all values at a given column,
`GetValuesAtColumn`.

[Get the full source code in this GitHub gist](https://gist.github.com/phelipetls/57a27f529561eefe73633093c737b7e0).

# How to use it

It's up to you how you're gonna use this code. Here's an example.

```vb
Sub DownloadReports

  Dim Username As String, Password As String, SecurityToken As String

  Username = "username"
  Password = "password"
  SecurityToken = "secret"

  Dim SessionId As String
  SessionId = SalesforceLogin(Username, Password, SecurityToken)

  If IsEmpty(SessionId) Then
      MsgBox "Authentication Error"
      Exit Sub
  End If

  Dim ReportId As String: ReportId = "REPORT_ID"
  Dim WorksheetName As String: WorksheetName = "MY_REPORT"

  Call DownloadEntireReport(ReportId, WorksheetName, SessionId, _
                            IdentifierColumn:="Número do caso", _
                            BooleanFilter:="1 AND 2 AND (3 OR 4)", _
                            startDate:="01/07/2020", _
                            endDate:="31/07/2020")

End Sub
```

# Final words

You probably have a better way to do it, I would only recommend this approach to
someone in an environment very dependent on Excel, simply because it is super
convenient. You can put the report anywhere you want with zero overhead -- no
need for a library to understand the complexity of an Excel archive.

And I gotta say, VBA is kind of a hard, its ecosystem is not great, obviously.
But I was very impressed by what it can do, despite of its shortcomings.
Nonetheless, it was still fun to write this.
