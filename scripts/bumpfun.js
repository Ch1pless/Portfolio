let clickDisp = document.getElementById(“clickDisp”),
clickBtn = document.getElementById(“clickBtn”),
counter = 0;
clickDisp.innerHTML=“”+counter+””;
clickBtn.addEventListener(“click”, () => {counter++; clickDisp.innerHTML=“”+counter+””;})