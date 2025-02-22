import { React, useState, useRef } from 'react';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import TextButton from '../components/TextButton';
import axios from 'axios';
import Alert from '../components/Alert';
import { Link, useNavigate } from 'react-router-dom';

const signUpPageStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-dark-gray{
        color: #535353;
    }

    .bg-glacier-blue{
        background-color: #98c4d4;
    }

    .ce-input::placeholder{
        color: #FFF;
    }

    .ce-input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #AAD390 inset !important;
        -webkit-text-fill-color: #535353 !important;
    }

    .login-forgot-pw{
        color: #91CAD6;
    }
`;

function SignUpPage(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const modalRef = useRef(null);
    const navigate = useNavigate();

    const validateEmptyFields = () => name.trim() !== '' && email.trim() !== '' && password.trim() !== '';

    const validatePasswordMatch = () => password === passwordConf;

    const validatePassword = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        return password.match(passwordRegex);
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.trim() === '' || emailRegex.test(email);
    };

    const signUpHandler = (event) => {
        event.preventDefault();
        if (!validateEmptyFields()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: preencha todos os campos' });
        } else if (!validateEmail()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: email inválido' });
        } else if (!validatePassword()) {
            modalRef.current.showModal({
                title: 'Falha no cadastro: a senha deve ter ao menos oito dígitos, caractere especial, letra maiúscula e letra minúscula',
            });
        } else if (!validatePasswordMatch()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: as senhas não coincidem' });
        } else {
            axios
                .post('https://genforms.c3sl.ufpr.br/api/user/signUp', {
                    email,
                    hash: password,
                    name,
                })
                .then((response) => {
                    if (response.data.message === 'User registered with sucess.') {
                        modalRef.current.showModal({ title: 'Cadastrado com sucesso', onHide: () => navigate('/login') });
                    } else {
                        modalRef.current.showModal({ title: 'Falha no cadastro: erro no servidor' });
                    }
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
        //.post('http://localhost:3333/user/signUp', {
    };

    return (
        <div className="d-flex flex-column font-barlow min-vh-100">
            <NavBar showNavTogglerMobile={false} showNavTogglerDesktop={false} />
            <div className="d-flex flex-column flex-grow-1 p-4 p-lg-5">
                <div className="row flex-column align-items-center flex-grow-1 w-100 m-0">
                    <div className="col-12 col-lg-8">
                        <div className="text-center w-100 mb-4 mb-lg-5">
                            <h1 className="color-dark-gray font-century-gothic fs-3 fw-bold pb-2 m-0">Cadastro de usuário</h1>
                            <h2 className="color-dark-gray fs-5 fw-medium m-0">Insira suas informações abaixo</h2>
                        </div>
                        <div className="text-center w-100 mb-3">
                            <label htmlFor="name-input" className="form-label fs-5">
                                Nome completo:
                            </label>
                            <input
                                id="name-input"
                                className="ce-input bg-glacier-blue text-white rounded-pill text-center fs-5 border-0 p-2 w-100"
                                placeholder="Nome completo"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="text-center w-100 mb-3">
                            <label htmlFor="email-input" className="form-label fs-5">
                                E-mail:
                            </label>
                            <input
                                id="email-input"
                                className={`ce-input bg-glacier-blue rounded-pill text-center fs-5 border-0 p-2 w-100 ${
                                    validateEmail() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="text-center w-100 mb-3">
                            <label htmlFor="password-input" className="form-label fs-5">
                                Senha:
                            </label>
                            <input
                                id="password-input"
                                className={`ce-input bg-glacier-blue rounded-pill text-center fs-5 border-0 p-2 w-100 ${
                                    validatePassword() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder="Senha"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="text-center w-100 mb-3">
                            <label htmlFor="password-conf-input" className="form-label fs-5">
                                Confirme a senha:
                            </label>
                            <input
                                id="password-conf-input"
                                className={`ce-input bg-glacier-blue rounded-pill text-center fs-5 border-0 p-2 w-100 ${
                                    validatePasswordMatch() && validatePassword() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder="Confirme a senha"
                                type="password"
                                value={passwordConf}
                                onChange={(e) => setPasswordConf(e.target.value)}
                            />
                        </div>
                        <div className="text-center w-100">
                            <Link to={'/login'} className="login-forgot-pw pb-2 fs-6">
                                Voltar para o login
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-between w-100 mt-5 mx-0">
                    <div className="col-1"></div>
                    <div className="col-auto align-items-center p-0">
                        <TextButton className="px-5" hsl={[97, 43, 70]} text="Cadastre-se" onClick={signUpHandler} />
                    </div>
                    <div className="col-1 d-flex align-items-end justify-content-end p-0">
                        <RoundedButton role="link" onClick={() => navigate('/help')} />
                    </div>
                </div>
            </div>

            <Alert id="SignUpModal" ref={modalRef} />
            <style>{signUpPageStyles}</style>
        </div>
    );
}

SignUpPage.defaultProps = {};

export default SignUpPage;
