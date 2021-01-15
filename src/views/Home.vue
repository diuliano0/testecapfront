<template>

    <div class="container mt-4" >
        teste
        <div v-if="correntista" class="row">
            <div class="col-3 ">
                Bem vindo, {{ correntista.name }}!.
                <div v-if="selected" class="col-sm">
                    Saldo: {{selected.saldo}}
                </div>
            </div>
            <div class="col-6">
                <select class="form-control" v-model="selected" @change="changeLocation">
                    <option selected>Selecione a conta a utilizar</option>
                    <option v-for="conta in contas" v-bind:key="conta.conta" v-bind:value="conta">
                        {{ conta.conta }} - {{ conta.dg_conta }}
                    </option>
                </select>
                <div class="row" v-if="type">
                    <form>
                        <div class="col-auto mt-2">
                            <label for="inputPassword2" class="visually-hidden">Valor do
                                {{(type===1)?'Depositar':'Sacar'}}</label>
                            <input type="text" v-model="valor" class="form-control" id="inputPassword2" placeholder="0.00">
                        </div>
                        <div class="col-auto mt-2" v-if="selected">
                            <button type="button" @click="depositar()" v-if="type ===1" class="btn btn-primary mb-3">
                                Depositar
                            </button>
                            <button type="button" @click="sacar()" v-if="type ===2" class="btn btn-primary mb-3">Sacar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="col-3 controles">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
                        @click="abrirFormSaque(1)">Depósito
                </button>
                <button type="button" class="btn btn-success" @click="abrirFormSaque(2)">Saque</button>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "Home",
        beforeCreate() {
            this.correntista = JSON.parse(localStorage.getItem('contas'));
        },
        data() {
            var user = JSON.parse(localStorage.getItem('user'));
            var contas = JSON.parse(localStorage.getItem('contas'));
            return {
                success: null,
                valor: null,
                type: null,
                error: null,
                selected: null,
                contas: contas,
                correntista: user
            };
        },
        computed: {
            ...mapGetters("auth", ["user"])
        },

        methods: {
            ...mapActions("auth", ["sendVerifyResendRequest", "sendSaque", "sendDeposito"]),

            verifyResend() {
                this.success = this.error = null;
                this.sendVerifyResendRequest()
                    .then(() => {
                        this.success =
                            "A fresh verification link has been sent to your email address.";
                    })
                    .catch(error => {
                        this.error = "Error sending verification link.";
                        console.log(error.response);
                        alert(this.error);
                    });

            },
            changeLocation(event) {
                console.log(event.target.value)
            },
            sacar() {
                if(this.valor <= 0){
                    alert('valor inválido!');
                    return;
                }
                this.sendSaque({
                    'valor':this.valor,
                    'conta_id': this.selected.id
                }, this.selected.id).then(() => {
                    alert("Saque realizado com sucesso");
                    this.type = null;
                    this.selected.saldo = parseFloat(this.selected.saldo) - parseFloat(this.valor);
                })
                    .catch(error => {
                        console.log(error.response);
                        alert("Não foi possivel sacar");
                    });
            },
            depositar() {
                if(this.valor <= 0){
                    alert('valor inválido!');
                    return;
                }
                this.sendDeposito({
                    'valor':this.valor,
                    'conta_id': this.selected.id
                }).then(() => {
                    alert("Depósito realizado com sucesso");
                    this.type = null;
                    this.selected.saldo = parseFloat(this.selected.saldo) + parseFloat(this.valor);
                })
                    .catch(error => {
                        this.error = "Error ao sacar.";
                        console.log(error.response);
                        alert("Não foi possivel depositar");
                    });
            },
            abrirFormSaque(value) {
                this.type = value;
            },
        }
    };
</script>
