const form       = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passInput  = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passError  = document.getElementById('passwordError');
const ruleUpper  = document.getElementById('ruleUpper');
const ruleNumber = document.getElementById('ruleNumber');
const rulePunct  = document.getElementById('rulePunct');

const emailRegex  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const upperRegex  = /[A-Z]/;
const numberRegex = /[0-9]/;
const punctRegex  = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

function actualizarRegla(elemento, cumple) {
  elemento.classList.toggle('ok', cumple);
  elemento.classList.toggle('bad', !cumple);
  elemento.textContent = (cumple ? '✓' : '✗') + ' ' + elemento.textContent.slice(2);
}

passInput.addEventListener('input', () => {
  const val = passInput.value;
  actualizarRegla(ruleUpper,  upperRegex.test(val));
  actualizarRegla(ruleNumber, numberRegex.test(val));
  actualizarRegla(rulePunct,  punctRegex.test(val));
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = emailInput.value.trim();
  const password = passInput.value;
  let valido = true;

  if (!emailRegex.test(email)) {
    emailError.style.display = 'block';
    emailInput.style.borderColor = '#e53e3e';
    valido = false;
  } else {
    emailError.style.display = 'none';
    emailInput.style.borderColor = '#22c55e';
  }

  const passValida = upperRegex.test(password) &&
                     numberRegex.test(password) &&
                     punctRegex.test(password);

  if (!passValida) {
    passError.style.display = 'block';
    passInput.style.borderColor = '#e53e3e';
    valido = false;
  } else {
    passError.style.display = 'none';
    passInput.style.borderColor = '#22c55e';
  }

  if (valido) {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      mostrarRespuesta(res.ok, data);

    } catch (error) {
      mostrarRespuesta(false, { message: "No se pudo conectar con el servidor" });
    }
  }
});

function mostrarRespuesta(exito, data) {
  const anterior = document.getElementById('resultado');
  if (anterior) anterior.remove();

  const div = document.createElement('div');
  div.id = 'resultado';
  div.style.marginTop = '1rem';
  div.style.padding = '0.8rem';
  div.style.borderRadius = '6px';
  div.style.fontSize = '0.85rem';
  div.style.wordBreak = 'break-all';

  if (exito) {
    div.style.background = '#f0fdf4';
    div.style.border = '1px solid #22c55e';
    div.style.color = '#166534';
    div.innerHTML = `<strong>Éxito</strong><br>${JSON.stringify(data, null, 2)}`;
  } else {
    div.style.background = '#fef2f2';
    div.style.border = '1px solid #e53e3e';
    div.style.color = '#991b1b';
    div.innerHTML = `<strong>Error</strong><br>${data.message}`;
  }

  document.querySelector('.card').appendChild(div);
}