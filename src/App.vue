<template>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  
  <div id="app">
    <!-- Menu inicial onde tem dois botões: Chat ou cadastrar novas perguntas -->
    <div class="menu">
        <button class="btn-primary">Conversar com o Chatbot</button>
        <button class="btn-secondary" @click="toggleForm">Registrar Nova Pergunta</button>
        <!-- <button class="btn-secondary" @click="toggleForm">Login</button> -->
    </div>
    <!-- Modal onde você pode conversar com o bot -->
    <div class="container">
      <div class="chat-header">
        Chat com o BOT
      </div> 
      <div class="messages" ref="messageBox">
        <div v-for="msg in messages" :key="msg.id" :class="`message ${msg.type}`">
          <span v-if="msg.type === 'bot'">🤖 diz: &nbsp;<br></span> {{ msg.text }}
        </div>
      </div>
      <div class="input-box">
        <input v-model="userInput" id="messageInput" @keyup.enter="sendMessage" placeholder="Digite sua mensagem...">
        <button @click="sendMessage">&#10148;</button>
      </div>
      <div class="exit-label"> Escreva "sair" para abandonar o chat...</div>
      <!-- Modal onde posso cadastrar novas perguntas -->
      <div class="form-container" v-if="showForm">
        <h2>Registrar Nova Pergunta</h2>
        <form @submit.prevent="handleSubmit">
            <div class="field">
                <label for="question">Pergunta:</label>
                <input type="text" v-model="question" id="question" name="question" required>
            </div>
            <div class="field">
                <label for="answer">Resposta:</label>
                <input type="text" v-model="answer" id="answer" name="answer" required>
            </div>
            <div class="field">
                <button type="submit" class="btn-primary">Adicionar</button>
                <button type="button" class="btn-cancel" @click="cancelForm">Cancelar</button>
            </div>
        </form>
      </div>
    </div>
  </div>
  <footer>
      by Fernando Silva 2023
  </footer>
</template>

<script>
export default {
  data() {
    return {
        userInput: '',
        messages: [],
        showForm: false,
        question: '',
        answer: '',
        isModalOpen: false
    };
  },

  methods: {
    async sendMessage() {
      if (!this.userInput) return;
      
      this.messages.push({ id: Date.now(), text: this.userInput, type: 'user' });
      console.log(this.messages)
      const response = await fetch('http://127.0.0.1:5000/pergunta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: this.userInput })
      });
      const data = await response.json();
      console.log(data)
      this.messages.push({ id: Date.now() + 1, text: data.response, type: 'bot' });
      this.scrollToBottom();
      
      this.userInput = '';
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async handleSubmit() {
      try {
          const requestData = {
              question: this.question,
              answer: this.answer
          };

          const response = await fetch('http://127.0.0.1:5000/add', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData)
          });

          if (!response.ok) {
              throw new Error('Erro ao enviar os dados');
          }

          const responseData = await response.json();
          console.log(responseData);
          this.showForm = false; // Opcional: fechar o formulário após a submissão

      } catch (error) {
          console.error("Erro:", error);
      }
    },
    loginWithFacebook() {
      // Implementação do login com Facebook
    },
    loginWithGoogle() {
      // Implementação do login com Google
    },
    cancelForm() {
        this.showForm = false;  // Isso irá esconder o formulário
    },
    mounted() {
    this.sendMessage('Olá, seja bem vindo, em que posso ajudar você hoje?'); 
    },
   
    scrollToBottom() {
        this.$nextTick(() => {
            if (this.$refs.messageBox) {
                const box = this.$refs.messageBox;
                box.scrollTop = box.scrollHeight;
            }
        });
    }
  }
}
</script>



<style scoped>

button {
  padding: 10px 15px;
  border: none;
  background-color: #39ff14; 
  color: #f0f0f0;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  transition: background-color 0.3s; 
}

button:hover {
  background-color: #2eb80e;  
}

body, html {
    font-family: Arial, sans-serif;
    color: #f0f0f0;  
    background-color: #1a1a1d !important;
    margin: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
}

body {
    background-image: url('~@/assets/Stories 9.png');
    background-size: cover; 
    background-position: center center; 
    background-attachment: fixed;
    height: 100%;
    margin: 10;
}

footer {
    padding: 20px 0;
    text-align: center;
    background-color: #1a1a1d;
    color: #f0f0f0;
    position: fixed;
    bottom: 0;
    width: 100%;
    font-size: 0.9em;
}

.container {
    height: 80vh;  
    display: flex;  
    flex-direction: column; 
    max-width: 900px;
    width: 900%;
    margin-top: 50px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #222;
    position: fixed;
    bottom: 8%;
    left: 50%;
    transform: translateX(-50%);
    background-image: url('~@/assets/Stories 9.png');
    background-size: cover;
    background-position: center center; 
    height: 80%;
    margin: 10;
  }

  .chat-header {
    padding: 10px 15px;
    background-color: #333;
    color: #777777; 
    font-weight: bold;
    border-top-left-radius: 5px; 
    border-top-right-radius: 5px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }

.exit-label {
  font-family: 'Roboto', sans-serif;
  color: grey;
  font-size: 10px;
}
.chat-container {
  max-width: 400px;
  margin: 40px auto;
  border: 1px solid #444;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.messages {
  overflow-y: auto;
  font-family: 'Roboto', sans-serif;
  color: grey;
  font-size: 13px;
  flex: 1;
  padding: 10px;
  height: 200px;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 80vh;
  flex-grow: 1;

}

.message {
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 5px;
}


.message.user {
  align-self: flex-end;
  background-color: #333;
}

.message.bot {
  color: white;
  background-color: #555;

}

.input-container {
  position: relative;
  display: flex;
  margin-top: 10px;
  align-items: center;
  width: 100%;
}

#messageInput {
  width: calc(100% - 40px); /* reduzimos a largura do input para acomodar o botão */
  padding: 10px; /* dê um pouco de padding */
  border: 1px solid #ccc; 
  border-radius: 4px; /* dê um pouco de border-radius se desejar */
  outline: none; /* remove o contorno ao focar */
}

#sendButton {
  position: absolute;
  right: 5px; /* ajuste conforme necessário */
  top: 50%;
  transform: translateY(-50%); 
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  outline: none;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px 0 0 4px;
  background-color: #333;
  color: #f0f0f0;
}

button {
  padding: 10px 15px;
  border: none;
  background-color: #555;
  color: #f0f0f0;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
}

.menu {
  background-color: #222;
  padding: 20px 40px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 20px;
}

.menu button .field button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  background-color: #555;
  color: #f0f0f0;
}

.menu button:hover {
    background-color: #777;
    transform: scale(1.05);
}

.form-container {
    font-family: 'Roboto', sans-serif;
    width: 400px;
    background-color: #2c2c2e;  /* fundo escuro */
    padding: 20px 40px;
    margin-top: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    z-index: 2000;
    position: relative;
    color: #f0f0f0;  /* Cor de texto clara para contraste */
}

.form-container h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #ffffff;
}

.field {
    margin-bottom: 20px;
}

.field label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #545252;
}

.field_input[type="text"] {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-family: 'Roboto', sans-serif;
}

.field button {
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    font-family: 'Roboto', sans-serif;
    font-weight: 700; /* bold */
    cursor: pointer;
    background-color: #555;
}
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Preto semi-transparente */
    z-index: 1000; /* Certifique-se de que o z-index seja suficientemente alto para cobrir outros elementos */
}

.btn-primary {
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-primary:hover {
    background-color: #0056b3;
}
.btn-cancel {
    background-color: #d9534f;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-left: 10px;
}

.btn-cancel:hover {
    background-color: #ffffff;
    color: gray
}

.message {
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 5px;
  font-size: 18px;
}

.message.user {
  background-color: #E9E9E9;
  align-self: flex-end;
  border-bottom-right-radius: 3px;
}

.message.bot {
  background-color: #4CAF50;
  color: white;
  align-self: flex-start;
  border-bottom-left-radius: 3px;
  display: flex;
  align-items: center;  /* Alinhar verticalmente o texto e o emoji */
}

.input-box {
    padding: 10px;  /* Espaçamento interno para a caixa de entrada */
    position: relative;
    display: flex;
    align-items: center;
    width: 97%;
}

.input-box input, .input-box textarea {
    width: 100%;  /* Ocupa 100% da largura disponível */
    padding: 8px;  /* Espaçamento interno para o texto */
    box-sizing: border-box;  /* Garante que o padding não aumente o tamanho total do input */
    font-size: 18px;
  }

</style>
