window.addEventListener("load", function () {
    var e = "theme=";
    var t = document.cookie.split(";");
    for (var c = 0; c < t.length; c++) {
        var i = t[c];
        while (" " == i.charAt(0)) i = i.substring(1);
        if (0 == i.indexOf(e)) theme = i.substring(e.length);
    }
    document.body.setAttribute("data-theme", theme || "sync");
});
