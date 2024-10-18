document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const affiliateCode = urlParams.get('ref');
    let globalAffiliateCode = affiliateCode;

    // Gerar o CAPTCHA
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const captchaResult = num1 + num2;
    document.getElementById('captcha-question').innerText = `${num1} + ${num2}`;

    if (affiliateCode) {
        fetch(`/api/dashboard/registerClick?ref=${affiliateCode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Clique registrado com sucesso.') {
                document.getElementById('affiliateMessage').innerText = `Olá, você foi indicado por: ${data.username}`;
            } else {
                console.error('Erro ao registrar o clique:', data.message);
                document.getElementById('affiliateMessage').innerText = 'Erro ao registrar o clique.';
            }
        })
        .catch(() => {
            console.error('Erro ao registrar o clique.');
            document.getElementById('affiliateMessage').innerText = 'Erro ao registrar o clique.';
        });
    }

    document.getElementById('leadForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verificar o CAPTCHA
        const userCaptchaInput = parseInt(document.getElementById('captcha').value, 10);
        if (userCaptchaInput !== captchaResult) {
            alert('O resultado do CAPTCHA está incorreto. Tente novamente.');
            return;
        }

        const nome = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const rua = document.getElementById('rua').value;
        const numero = document.getElementById('numero').value;
        const bairro = document.getElementById('bairro').value;
        const cidade = document.getElementById('cidade').value;
        const ref = globalAffiliateCode;

        try {
            const response = await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, telefone, rua, numero, bairro, cidade, ref })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Lead cadastrado com sucesso!');
            } else {
                alert('Erro ao cadastrar lead: ' + result.message);
            }
        } catch (error) {
            alert('Erro ao cadastrar lead: ' + error.message);
        }
    });
});
