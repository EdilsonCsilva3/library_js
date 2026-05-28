const Calendar = (calendar_id) => {
    const __id__ = "calendar";
    let calendar = null;
    if (calendar_id !== undefined)
        calendar = document.getElementById(calendar_id);
    else
        calendar = document.getElementById(__id__);

    if (calendar == null || calendar == undefined) {
        throw new Error("Modal Calendar not defined ");
    }

    let inputAtivo = null;
    
    // Guardamos o dia, mês e ano exatos de "hoje" na memória
    let diaAtualSistema = null;
    let mesAtualSistema = null;
    let anoAtualSistema = null;

    const selectDia = document.getElementById('dia');
    const selectMes = document.getElementById('mes');
    const selectAno = document.getElementById('ano');

    // MÁGICA DOS DIAS: Atualiza os dias sempre que o mês ou o ano mudam
    function atualizarDias() {
        const anoSelecionado = parseInt(selectAno.value);
        const mesSelecionado = parseInt(selectMes.value);
        
        // Pega o dia que estava marcado, ou usa o dia de hoje como fallback
        let diaSelecionado = parseInt(selectDia.value) || diaAtualSistema;

        // O JavaScript descobre sozinho quantos dias tem o mês (ex: 28, 29, 30 ou 31)
        const ultimoDiaDoMes = new Date(anoSelecionado, mesSelecionado, 0).getDate();
        
        let diaInicial = 1;

        // Se estivermos no ano atual E no mês atual, os dias começam do dia de "hoje"
        if (anoSelecionado === anoAtualSistema && mesSelecionado === mesAtualSistema) {
            diaInicial = diaAtualSistema;
        }

        // Garante que o dia selecionado não fique fora do limite do mês gerado
        diaSelecionado = Math.max(diaInicial, Math.min(diaSelecionado, ultimoDiaDoMes));

        popularSelection('dia', diaInicial, ultimoDiaDoMes, true, diaSelecionado);
    }

    // Escuta mudança de ANO
    selectAno.addEventListener('change', function() {
        const anoSelecionado = parseInt(this.value);
        const mesSelecionado = parseInt(selectMes.value);
        
        if (anoSelecionado === anoAtualSistema) {
            popularSelection('mes', mesAtualSistema, 12, true, Math.max(mesSelecionado, mesAtualSistema));
        } else {
            popularSelection('mes', 1, 12, true, mesSelecionado);
        }
        
        // Sempre que o ano muda, precisamos recalcular os dias
        atualizarDias();
    });

    // Escuta mudança de MÊS
    selectMes.addEventListener('change', function() {
        // Sempre que o mês muda, calculamos se tem 30/31 dias e qual o dia inicial
        atualizarDias();
    });


    function show(elementoClicado) {
        inputAtivo = elementoClicado;

        const hoje = new Date();
        diaAtualSistema = hoje.getDate();
        mesAtualSistema = hoje.getMonth() + 1;
        anoAtualSistema = hoje.getFullYear();
        const horaAtual = hoje.getHours();
        const minutoAtual = hoje.getMinutes();

        // 1. Popula primeiro o Ano
        popularSelection('ano', anoAtualSistema, anoAtualSistema + 3, false, anoAtualSistema); 
        
        // 2. Popula o Mês
        popularSelection('mes', mesAtualSistema, 12, true, mesAtualSistema);       
        
        // 3. Usa a nossa função inteligente para popular os Dias corretos
        atualizarDias();
        
        popularSelection('hora', 0, 23, true, horaAtual);      
        popularSelection('minuto', 0, 59, true, minutoAtual);    
        
        calendar.classList.add('_modal_calendar--show');
    }

    function close() {
        calendar.classList.remove('_modal_calendar--show');
        inputAtivo = null; 
    }

    function confirm() {
        if (!inputAtivo) return; 

        const dia = document.getElementById('dia').value.padStart(2, '0');
        const mes = document.getElementById('mes').value.padStart(2, '0');
        const ano = document.getElementById('ano').value;
        const hora = document.getElementById('hora').value.padStart(2, '0');
        const minuto = document.getElementById('minuto').value.padStart(2, '0');

        inputAtivo.value = `${dia}/${mes}/${ano} ${hora}:${minuto}`;

        close(); 
    }

    function popularSelection(idElemento, valorInicial, valorFinal, colocarZeroEsquerda = false, valorSelecionado = null) {
        const select = document.getElementById(idElemento);
        select.innerHTML = ''; 

        for (let i = valorInicial; i <= valorFinal; i++) {
            const option = document.createElement('option');
            option.value = i;
            
            if (colocarZeroEsquerda) {
                option.text = i.toString().padStart(2, '0');
            } else {
                option.text = i;
            }

            if (i === valorSelecionado) {
                option.selected = true;
            }

            select.appendChild(option);
        }
    }

    return {
        show, close, confirm
    };
}