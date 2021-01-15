import axios from "axios";

export default {
    namespaced: true,
    endpoint: "http://127.0.0.1:8200/api/v1/",

    state: {
        userData: null
    },

    getters: {
        user: state => state.userData
    },

    mutations: {
        setUserData(state, user) {
            state.userData = user;
        }
    },

    actions: {
        getUserData({commit}) {
            axios
                .get("http://127.0.0.1:8200/api/v1/user/perfil")
                .then(response => {
                    commit("setUserData", response.data);
                    localStorage.setItem("user", JSON.stringify(response.data));
                });
        },
        sendLoginRequest({commit}, data) {
            commit("setErrors", {}, {root: true});

            data.client_id = 2;
            data.client_secret = "jHdEyeDHKbqxzLVGoIqzQYNdIGkDJ4XYGmxKU8XE";
            data.grant_type = "password";

            return axios
                .post("http://127.0.0.1:8200/api/v1/token", data)
                .then(response => {
                    localStorage.setItem("authToken", response.data.access_token);
                    axios
                        .get("http://127.0.0.1:8200/api/v1/user/perfil")
                        .then(response => {
                            commit("setUserData", response.data);
                            localStorage.setItem("user", JSON.stringify(response.data));
                            axios
                                .get("http://127.0.0.1:8200/api/v1/admin/banco/conta", {
                                    headers: {
                                        "Authorization": localStorage.getItem('authToken')
                                    }
                                })
                                .then(response => {
                                    localStorage.setItem('contas', JSON.stringify(response.data));
                                });
                        });
                });
        },
        sendSaque({commit}, data) {
            commit("setErrors", {}, {root: true});
            return axios
                .post("http://127.0.0.1:8200/api/v1/admin/banco/conta/saque/"+data.conta_id, data, {
                    headers: {
                        "Authorization": localStorage.getItem('authToken')
                    }
                })
                .then(response => {
                    commit("setUserData", response.data.user);
                    axios
                        .get("http://127.0.0.1:8200/api/v1/admin/banco/conta", {
                            headers: {
                                "Authorization": localStorage.getItem('authToken')
                            }
                        })
                        .then(response => {
                            localStorage.setItem('contas', JSON.stringify(response.data));
                        });
                });

        },
        sendDeposito({commit}, data) {
            commit("setErrors", {}, {root: true});
            return axios
                .post("http://127.0.0.1:8200/api/v1/admin/banco/conta/deposito/"+data.conta_id, data, {
                    headers: {
                        "Authorization": localStorage.getItem('authToken')
                    }
                })
                .then(response => {
                    commit("setUserData", response.data.user);
                    axios
                        .get("http://127.0.0.1:8200/api/v1/admin/banco/conta", {
                            headers: {
                                "Authorization": localStorage.getItem('authToken')
                            }
                        })
                        .then(response => {
                            localStorage.setItem('contas', JSON.stringify(response.data));
                        });
                });

        },
        getMinhasContas({commit}) {
            commit("setErrors", {}, {root: true});
            return axios
                .get("http://127.0.0.1:8200/api/v1/admin/banco/conta", {
                    headers: {
                        "Authorization": localStorage.getItem('authToken')
                    }
                })
                .then(response => {
                    commit("setContas", response.data);
                    localStorage.setItem('contas', response.data);
                });
        },
        getPerfil({commit}) {
            commit("setErrors", {}, {root: true});
            return axios
                .get("http://127.0.0.1:8200/api/v1/user/perfil");
        },
        sendRegisterRequest({commit}, data) {
            commit("setErrors", {}, {root: true});
            return axios
                .post(process.env.VUE_APP_API_URL + "register", data)
                .then(response => {
                    commit("setUserData", response.data.user);
                    localStorage.setItem("authToken", response.data.access_token);
                });
        },
        sendLogoutRequest({commit}) {
            commit("setUserData", null);
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            localStorage.removeItem("contas");
        },
        sendVerifyResendRequest() {
            return axios.get(process.env.VUE_APP_API_URL + "email/resend");
        },
        sendVerifyRequest({dispatch}, hash) {
            return axios
                .get(process.env.VUE_APP_API_URL + "email/verify/" + hash)
                .then(() => {
                    dispatch("getUserData");
                });
        }
    }
};
