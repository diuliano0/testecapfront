<template>
    <div class="login mt-5">
        <div class="card">
            <div class="card-header">
                Login
            </div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label for="username">E-mail address</label>
                        <input
                                type="email"
                                class="form-control"
                                :class="{ 'is-invalid': errors.username }"
                                id="username"
                                v-model="details.username"
                                placeholder="Enter username"
                        />
                        <div class="invalid-feedback" v-if="errors.username">
                            {{ errors.username[0] }}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input
                                type="password"
                                class="form-control"
                                :class="{ 'is-invalid': errors.password }"
                                id="password"
                                v-model="details.password"
                                placeholder="Password"
                        />
                        <div class="invalid-feedback" v-if="errors.password">
                            {{ errors.password[0] }}
                        </div>
                    </div>
                    <button type="button" @click="login" class="btn btn-primary">
                        Login
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "Home",

        data: function () {
            return {
                details: {
                    username: null,
                    password: null
                }
            };
        },

        computed: {
            ...mapGetters(["errors"])
        },

        mounted() {
            this.$store.commit("setErrors", {});
        },

        methods: {
            ...mapActions("auth", ["sendLoginRequest"]),

            login: function () {
                this.sendLoginRequest(this.details).then(() => {
                    setTimeout(() => {
                        this.$router.push({name: "Home"});
                    }, 3000);
                });
            }
        }
    };
</script>
