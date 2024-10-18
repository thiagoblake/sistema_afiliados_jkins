document.addEventListener('DOMContentLoaded', () => {
    const affiliateCode = localStorage.getItem('affiliateCode');
    const token = localStorage.getItem('token');

    if (!affiliateCode || !token) {
      alert('Você precisa estar logado.');
      window.location.href = 'index.html';
      return;
    }

    const affiliateLink = `https://indica.souuni.com/form.html?ref=${affiliateCode}`;
    document.getElementById('affiliateLink').href = affiliateLink;
    document.getElementById('affiliateLink').textContent = affiliateLink;

    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');

    if (ref) {
      fetch(`/api/dashboard/registerClick?ref=${ref}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          if (!data.message) {
            console.error('Erro ao registrar o clique:', data);
          }
        })
        .catch(() => {
          console.error('Erro ao registrar o clique.');
        });
    }

    const fetchClicks = async (startDate = '', endDate = '') => {
      try {
        const url = new URL('/api/dashboard', window.location.origin);
        if (startDate) url.searchParams.append('startDate', startDate);
        if (endDate) url.searchParams.append('endDate', endDate);

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          }
        });

        const data = await response.json();

        if (response.ok) {
          document.getElementById('totalClicks').textContent = data.totalClicks;
        } else {
          alert(data.message || 'Erro ao buscar os cliques.');
        }
      } catch (error) {
        alert('Erro ao buscar os cliques.');
      }
    };

    fetchClicks();

    document.getElementById('filterButton').addEventListener('click', () => {
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;
      fetchClicks(startDate, endDate);
    });
  });