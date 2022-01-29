const resumeMenuLink = document.querySelector("#resume-download");

const resumeRepoLatestReleaseUrl = "https://api.github.com/repos/phelipetls/resume/releases/latest";

fetch(resumeRepoLatestReleaseUrl).then(function(response) {
  return response.json();
}).then(function(json) {
  const resumeDownloadUrl = json.assets[0].browser_download_url;
  resumeMenuLink.href = resumeDownloadUrl;
});
