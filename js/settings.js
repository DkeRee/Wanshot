//manage settings + import settings from localStorage

const volumeSlider = document.getElementById("volume-bar");
const wasdToggle = document.getElementById("wasd-toggle");
const exhaustToggle = document.getElementById("exhaust-toggle");
const rgbToggle = document.getElementById("rgb-toggle");

//init settings
volumeSlider.value = localStorage.getItem("volume");
if (SETTING_WASD) {
	wasdToggle.checked = true;
}
if (SETTING_EXHAUST) {
	exhaustToggle.checked = true;
}

if (localStorage.getItem("beaten-game")) {
	if (SETTING_RGB) {
		rgbToggle.checked = true;
	}
} else {
	//hasn't beaten game yet
	rgbToggle.onclick = "return false";
	rgbToggle.classList.remove("toggle");
	document.getElementsByClassName("slider")[2].classList.add("locked-toggle");
}

volumeSlider.addEventListener("change", () => {
	localStorage.setItem("volume", volumeSlider.value);
	SETTING_VOLUME = Number(localStorage.getItem("volume"));
	toggleVolume(SETTING_VOLUME);
});

wasdToggle.addEventListener("change", () => {
	if (wasdToggle.checked) {
		//toggle classic wasd on
		localStorage.setItem("wasd", "true");
	} else {
		//toggle classic wasd off
		localStorage.setItem("wasd", "false");
	}
	//convert to boolean
	SETTING_WASD = (localStorage.getItem("wasd") === "true");
});

exhaustToggle.addEventListener("change", () => {
	if (exhaustToggle.checked) {
		//toggle exhaust on
		localStorage.setItem("exhaust", "true");
	} else {
		//toggle exhaust off
		localStorage.setItem("exhaust", "false");
	}
	//convert to boolean
	SETTING_EXHAUST = (localStorage.getItem("exhaust") === "true");
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