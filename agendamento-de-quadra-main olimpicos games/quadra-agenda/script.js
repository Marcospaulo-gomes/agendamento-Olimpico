document.addEventListener("DOMContentLoaded", () => {
 
  // ===== LISTAR QUADRAS =====
  if (window.location.pathname.includes("quadras.html")) {
    const listaQuadras = document.getElementById("listaQuadras");

    if (listaQuadras) {
      const quadras = [
        { nome: "AREIA", local: "Térreo" },
        { nome: "CAMPO SINTETICO ", local: "Térreo " },
        { nome: "MULTIESPORTIVA", local: "3° Andar" }
      ];

      quadras.forEach((quadra) => {
        const div = document.createElement("div");
        div.classList.add("quadra");

        div.innerHTML = `
          <h3>${quadra.nome}</h3>
          <p>Local: ${quadra.local}</p>
          <a href="agendamento.html?quadra=${encodeURIComponent(quadra.nome)}">
            <button>Agendar</button>
          </a>
        `;

        listaQuadras.appendChild(div);
      });
    }
  }

  // ===== FORMULÁRIO DE AGENDAMENTO =====
  if (window.location.pathname.includes("agendamento.html")) {
    const form = document.querySelector("form");

    if (form) {
      const urlParams = new URLSearchParams(window.location.search);
      const quadraSelecionada = urlParams.get("quadra");
      const quadraInput = document.getElementById("quadra");
      const horaSelect = document.getElementById("horaDisponivel");
      const dataInput = document.getElementById("data");

      if (quadraSelecionada && quadraInput) {
        quadraInput.value = quadraSelecionada;
      }

      const hoje = new Date();
      const yyyy = hoje.getFullYear();
      const mm = String(hoje.getMonth() + 1).padStart(2, "0");
      const dd = String(hoje.getDate()).padStart(2, "0");
      const dataAtual = `${yyyy}-${mm}-${dd}`;

      dataInput.value = dataAtual;
      dataInput.min = dataAtual;

      function gerarHorariosDisponiveis() {
        horaSelect.innerHTML = '<option value="">Selecione um horário</option>';
        for (let h = 8; h <= 21; h++) {
          const horaStr = `${String(h).padStart(2, "0")}:00`;
          const opt = document.createElement("option");
          opt.value = horaStr;
          opt.textContent = `${horaStr} - ${String(h + 1).padStart(2, "0")}:00`;
          horaSelect.appendChild(opt);
        }
      }

      gerarHorariosDisponiveis();

      // Submissão do formulário
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const quadra = quadraInput.value;
        const data = dataInput.value;
        const hora = horaSelect.value;

        if (!quadra || !data || !hora) {
          alert("Preencha todos os campos.");
          return;
        }

        const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

        const conflito = agendamentos.find(
          (ag) => ag.quadra === quadra && ag.data === data && ag.hora === hora
        );

        if (conflito) {
          alert("Este horário já está ocupado para esta quadra. Escolha outro horário.");
          return;
        }

        const novoAgendamento = { quadra, data, hora };
        agendamentos.push(novoAgendamento);
        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

        // ✅ Redireciona para WhatsApp com mensagem personalizada
        const telefone = "556284164230";
        const mensagem = `Olá! Quero agendar a ${quadra} no dia ${data} às ${hora}.`;
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

        window.location.href = url;
      });
    }
  }

  // ===== MEUS AGENDAMENTOSestão em meus.hmtl,  =====
  if (window.location.pathname.includes("meus.html")) {
    const listaAgendamentos = document.getElementById("listaAgendamentos");

    function carregarAgendamentos() {
      let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];

      if (agendamentos.length === 0) {
        listaAgendamentos.innerHTML = "<p style='text-align:center;color:#028abd;font-size:20px;'>Você ainda não possui agendamentos.</p>";
        return;
      }

      // Exibir o mais recente primeiro
      agendamentos = agendamentos.reverse();

      listaAgendamentos.innerHTML = "";

      agendamentos.forEach((agendamento, indexOriginal) => {
        const index = agendamentos.length - 1 - indexOriginal;

        const card = document.createElement("div");
        card.className = "agendamento-card";

        card.innerHTML = `
            <div class="agendamento-info">
              <p><strong>Quadra:</strong> ${agendamento.quadra}</p>
              <p><strong>Data:</strong> ${agendamento.data}</p>
              <p><strong>Horário:</strong> ${agendamento.hora}</p>
            </div>
            <button class="cancelar-btn" data-index="${index}">Cancelar</button>
          `;

        listaAgendamentos.appendChild(card);
      });

      // Eventos de cancelamento
      document.querySelectorAll(".cancelar-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = parseInt(btn.getAttribute("data-index"));
          let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
          agendamentos.splice(index, 1);
          localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
          carregarAgendamentos(); // Recarrega após cancelar
        });
      });
    }

    carregarAgendamentos();
  }

});

