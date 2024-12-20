
document.getElementById("pattern-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const patternsInput = document.getElementById("patterns").value;
    const patternsArray = patternsInput.split(",").map(Number).filter(n => !isNaN(n));
    localStorage.setItem("patterns", patternsArray.join(","));
    document.getElementById("status").innerText = "Patterns saved successfully!";
});
