// Função para buscar o CEP
async function buscarCep() {
    const cep = document.getElementById('cep').value.trim();
    if (/^[0-9]{8}$/.test(cep)) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                document.getElementById('rua').value = data.logradouro;
                document.getElementById('bairro').value = data.bairro; // Adicionado campo bairro
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
            } else {
                alert("CEP não encontrado!");
            }
        } catch (error) {
            alert("Erro ao buscar o CEP.");
        }
    } else {
        alert("CEP inválido!");
    }
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false; // Verifica se tem 11 dígitos ou todos os números são iguais
    }

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

// Evento para validar CPF
document.getElementById('cpf').addEventListener('blur', function () {
    const cpf = this.value.trim();
    const mensagemCPF = document.getElementById('mensagem-cpf');

    if (!validarCPF(cpf)) {
        mensagemCPF.textContent = 'CPF inválido!';
        mensagemCPF.style.color = 'red';
    } else {
        mensagemCPF.textContent = 'CPF válido!';
        mensagemCPF.style.color = 'green';
    }
});

// Validação do formulário
document.getElementById('cadastroForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    let valid = true;

    // Validação simples para campos obrigatórios
    for (let [key, value] of formData.entries()) {
        if (!value.trim() && key !== "complemento") {
            valid = false;
            alert(`O campo ${key} é obrigatório.`);
            break;
        }
    }

    // Validação do email
    const email = document.getElementById('email').value.trim();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email && !emailPattern.test(email)) {
        valid = false;
        alert("O e-mail informado é inválido.");
    }

    // Validação do CPF
    const cpf = document.getElementById('cpf').value.trim();
    if (!validarCPF(cpf)) {
        valid = false;
        alert("O CPF informado é inválido.");
    }

    if (valid) {
        alert('Cadastro enviado com sucesso!');
        this.reset();
        document.getElementById('mensagem-cpf').textContent = ''; // Limpa a mensagem do CPF
    }
});
document.getElementById('limparForm').addEventListener('click', () => {
    document.getElementById('cadastroForm').reset(); // Limpa todos os campos do formulário
});