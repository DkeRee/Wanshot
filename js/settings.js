//manage settings + import settings from localStorage

const volumeSlider = document.getElementById("volume-bar");
const headlightToggle = document.getElementById("headlight-toggle");

//init settings
volumeSlider.value = localStorage.getItem("volume");
if (SETTING_HEADLIGHTS) {
	headlightToggle.checked = true;
}

volumeSlider.addEventListener("change", () => {
	localStorage.setItem("volume", volumeSlider.value);
	SETTING_VOLUME = Number(localStorage.getItem("volume"));
	toggleVolume(SETTING_VOLUME);
});

headlightToggle.addEventListener("change", () => {
	if (headlightToggle.checked) {
		//toggle headlights on
		localStorage.setItem("headlights", "true");
	} else {
		//toggle headlights off
		localStorage.setItem("headlights", "false");
	}
	//convert to boolean
	SETTING_HEADLIGHTS = (localStorage.getItem("headlights") === "true");
});