document.addEventListener('DOMContentLoaded', () => {
    const pesquisaForm = document.getElementById('pesquisaform');
    const sugestaoTextarea = document.getElementById('sugestao');
    const charCountSpan = document.getElementById('charCount');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const maxLength = 500;

    if (sugestaoTextarea && charCountSpan) {
        charCountSpan.textContent = maxLength;

        sugestaoTextarea.addEventListener('input', () => {
            const currentLength = sugestaoTextarea.value.length;
            const remaining = maxLength - currentLength;
            charCountSpan.textContent = remaining;
        });
    }

    if (pesquisaForm) {
        pesquisaForm.addEventListener('submit', (event) => {
            event.preventDefault();

            feedbackMessage.classList.add('hidden');
            feedbackMessage.classList.remove('success', 'error');

            let isValid = true;
            const formData = {};

            const nomeInput = document.getElementById('nome');
            formData.nome = nomeInput.value.trim();

            // === AQUI ESTÁ A CORREÇÃO FINAL ===
            const departamentoSelect = document.getElementById('departamento'); // Mudado de 'departament' para 'departamento'
            formData.departamento = departamentoSelect.value;                 // Mudado de 'formData.departament' para 'formData.departamento'
            // ===================================

            const radioGroups = ['valorizacao', 'cargaTrabalho', 'estrutura-fisica'];

            radioGroups.forEach(groupName => {
                const radios = document.querySelectorAll(`input[name="${groupName}"]`);
                let isRadioSelected = false;
                radios.forEach(radio => {
                    if (radio.checked) {
                        formData[groupName] = radio.value;
                        isRadioSelected = true;
                    }
                });
                if (!isRadioSelected) {
                    isValid = false;
                }
            });

            if (!isValid) {
                displayFeedback('Por favor, preencha todos os campos obrigatórios (perguntas de múltipla escolha).', 'error');
                return;
            }

            try {
                const storedData = JSON.parse(localStorage.getItem('pesquisasQVT')) || [];
                storedData.push(formData);
                localStorage.setItem('pesquisasQVT', JSON.stringify(storedData));

                displayFeedback('Sua pesquisa foi enviada com sucesso! Agradecemos sua contribuição.', 'success');
                pesquisaForm.reset();
                if (charCountSpan) {
                    charCountSpan.textContent = maxLength;
                }

                console.log('Dados da pesquisa:', formData);
                console.log('Todos os dados armazenados:', storedData);

            } catch (e) {
                console.error('Erro ao armazenar dados no localStorage:', e);
                displayFeedback('Ocorreu um erro ao enviar sua pesquisa. Por favor, tente novamente.', 'error');
            }
        });
    }

    function displayFeedback(message, type) {
        if (feedbackMessage) {
            feedbackMessage.textContent = message;
            feedbackMessage.classList.remove('hidden');
            feedbackMessage.classList.add('feedback-message', type);
            feedbackMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});