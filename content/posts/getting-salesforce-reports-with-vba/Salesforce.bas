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
