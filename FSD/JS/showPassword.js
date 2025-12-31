function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    const eye = icon.querySelector("i");

    if (!input || !eye) return;

    if (input.type === "password") {
        input.type = "text";
        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        eye.classList.remove("fa-eye-slash");
        eye.classList.add("fa-eye");
    }
}
