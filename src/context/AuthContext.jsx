import { createContext, useReducer, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

const ACTIONS = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
    SET_USER: "SET_USER",
    ADD_TASK: "ADD_TASK",
    SET_TASKS: "SET_TASKS",
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
            };
        case ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload.user,
            };
        case ACTIONS.LOGOUT:
            return {
                isAuthenticated: false,
                user: null,
                token: null,
                tasks: [],
            };
        case ACTIONS.ADD_TASK:
            return {
                ...state,
                tasks: [...state.tasks, action.payload],
            };
        case ACTIONS.SET_TASKS:
            return {
                ...state,
                tasks: action.payload,
            };
        default:
            return state;
    }
}

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        token: localStorage.getItem("authToken") || null,
        user: JSON.parse(localStorage.getItem("user")) || null,
        isAuthenticated: !!localStorage.getItem("authToken"),
        tasks: [],
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (state.isAuthenticated) {
            localStorage.setItem("authToken", state.token);
            localStorage.setItem("user", JSON.stringify(state.user));
        } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        }
    }, [state.isAuthenticated, state.token, state.user]);

    useEffect(() => {
        if (state.isAuthenticated && state.token && !state.user) {
            const fetchProfile = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`, {
                        headers: {
                            Authorization: `Token ${state.token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Error al obtener datos del perfil');
                    }
                    const data = await response.json();
                    dispatch({ type: ACTIONS.SET_USER, payload: { user: data } });
                } catch (error) {
                    console.error('Error al obtener datos del perfil:', error);
                }
            };

            fetchProfile();
        }
    }, [state.isAuthenticated, state.token, state.user]);

    const actions = {
        login: (token) => {
            dispatch({ type: ACTIONS.LOGIN, payload: { token } });
            const origin = location.state?.from?.pathname || "/";
            navigate(origin);
        },
        logout: () => {
            dispatch({ type: ACTIONS.LOGOUT });
            navigate("/login");
        },
        addTask: (task) => {
            dispatch({ type: ACTIONS.ADD_TASK, payload: task });
        },
        setTasks: (tasks) => {
            dispatch({ type: ACTIONS.SET_TASKS, payload: tasks });
        },
    };

    return (
        <AuthContext.Provider value={{ state, actions }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuth };