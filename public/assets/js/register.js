document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cnpj_cpf = document.getElementById('cnpj_cpf').value;

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, cnpj_cpf })
    });
    const result = await response.json();

    if (response.ok) {
      alert('Registrado com sucesso!');
      window.location.href = 'index.html';
    } else {
      alert(result.message || 'Erro no registro');
    }
  });