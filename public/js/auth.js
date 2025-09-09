const API = "/api";
document.getElementById("btnLogin").onclick = async () => {
  const username = document.getElementById("username").value;
  const senha = document.getElementById("senha").value;
  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, senha }),
  });
  const data = await res.json();
  if (data.ok) {
    localStorage.setItem("token", data.token);
    window.location = "dashboard.html";
  } else {
    document.getElementById("msg").innerText = data.msg || "Erro";
  }
};
