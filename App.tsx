import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import * as SecureStore from "expo-secure-store";

import { useEffect, useState, createContext } from "react";

// =================== screen ===================
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import PlaceInformation from "./screens/placeInformation";
import Loading from "./screens/Loading";
import Invitation from "./screens/invitation";
import Tab from "./screens/tab";
import InviteVerify from "./screens/InviteVerify";

// =================== type ===================
import { StackParamList } from "./interface/navigate";

import { API_URL } from "@env";
import axios from "axios";

import * as Linking from "expo-linking";

import { FAIL, LOADING, SUCCESS } from "./utils/const";

import { AuthData } from "./contexts/authContext";

import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout } from "@ui-kitten/components";
import PlaceSelect from "./screens/placeSelect";
import PlaceDiscovery from "./screens/placeDiscovery";
import Review from "./screens/review";
import PlanSelect from "./screens/planSelect";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const prefix = Linking.createURL("/");

export default function App() {
    // =================== deepLink ===================
    const config = {
        screens: {
            inviteVerify: "inviteVerify/:inviteLink",
        },
    };

    const linking = {
        prefixes: [prefix],
        config,
    };

    // =================== useEffect ===================

    useEffect(() => {
        authCheck();
    }, []);

    // =================== useState ===================
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    const [authInformation, setAuthInformation] = useState({
        authStatus: LOADING,
        token: "",
        userId: "",
    });

    const [isSignedIn, setIsSignedIn] = useState<Boolean>(false);

    const Stack = createNativeStackNavigator<StackParamList>();

    // =================== function ===================

    const authCheck = async () => {
        try {
            const localToken = await SecureStore.getItemAsync("key");
            if (!localToken) throw new Error("can't get token");
            const response = await axios.get(`${API_URL}/authCheck`, {
                headers: {
                    authorization: localToken,
                },
            });
            console.log("authCheck");
            setAuthInformation({
                authStatus: SUCCESS,
                token: localToken,
                userId: response.data.userId,
            });
            setIsSignedIn(true);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            setAuthInformation({
                authStatus: FAIL,
                token: "",
                userId: "",
            });
            // if (axios.isAxiosError(error) && error.response) {
            //   setAuthInformation({
            //     authStatus: FAIL,
            //     token: "",
            //     userId: "",
            //   });
            //   console.log(error.response.data);
            // }
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ApplicationProvider {...eva} theme={eva.light}>
                <AuthData.Provider
                    value={{
                        ...authInformation,
                        setIsSignedIn: setIsSignedIn,
                        setAuthInformation: setAuthInformation,
                    }}
                >
                    <NavigationContainer linking={linking}>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false,
                                animation: "none",
                            }}
                        >
                            {isLoading ? (
                                <Stack.Screen
                                    name="loading"
                                    component={Loading}
                                />
                            ) : isSignedIn ? (
                                <>
                                    <Stack.Screen name="tab" component={Tab} />
                                    <Stack.Screen
                                        name="invitation"
                                        component={Invitation}
                                    />
                                    <Stack.Screen
                                        name="placeSelect"
                                        component={PlaceSelect}
                                    />
                                    <Stack.Screen
                                        name="placeInformation"
                                        component={PlaceInformation}
                                    />
                                    <Stack.Screen
                                        name="placeDiscovery"
                                        component={PlaceDiscovery}
                                    />
                                    <Stack.Screen
                                        name="planSelect"
                                        component={PlanSelect}
                                    />
                                    <Stack.Screen
                                        name="review"
                                        component={Review}
                                    />
                                </>
                            ) : (
                                <>
                                    <Stack.Screen
                                        name="signIn"
                                        component={SignIn}
                                    />
                                    <Stack.Screen
                                        name="signUp"
                                        component={SignUp}
                                    />
                                </>
                            )}

                            <Stack.Screen
                                name="inviteVerify"
                                component={InviteVerify}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </AuthData.Provider>
            </ApplicationProvider>
        </GestureHandlerRootView>
    );
}
