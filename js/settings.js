//manage settings + import settings from localStorage

const volumeSlider = document.getElementById("volume-bar");
const headlightToggle = document.getElementById("headlight-toggle");
const rgbToggle = document.getElementById("rgb-toggle");

//init settings
volumeSlider.value = localStorage.getItem("volume");
if (SETTING_HEADLIGHTS) {
	headlightToggle.checked = true;
}

if (localStorage.getItem("beaten-game")) {
	if (SETTING_RGB) {
		rgbToggle.checked = true;
	}
} else {
	//hasn't beaten game yet
	rgbToggle.onclick = "return false";
	rgbToggle.classList.remove("toggle");
	document.getElementsByClassName("slider")[1].classList.add("locked-toggle");
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

rgbToggle.addEventListener("change", () => {
	if (localStorage.getItem("beaten-game") == "true") {
		if (rgbToggle.checked) {
			//toggle rgb on
			localStorage.setItem("rgb", "true");
		} else {
			//toggle rgb off
			localStorage.setItem("rgb", "false");
		}
		//convert to boolean
		SETTING_RGB = (localStorage.getItem("rgb") === "true");
	}
});