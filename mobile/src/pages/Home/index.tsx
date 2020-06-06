import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  ImageBackground,
  View,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [loadingCities, setLoadingCities] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);

        setUfs(ufInitials.sort());
      });
  }, []);

  useEffect(() => {
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);

        setCities(cityNames.sort());
        setLoadingCities(false);
      });
  }, [selectedUf]);

  function handleChangeUF(value: string) {
    setSelectedUf(value);
    setLoadingCities(true);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.picker}>
            <RNPickerSelect
              onValueChange={(value) => handleChangeUF(value)}
              placeholder={{ label: "Selecione a UF..." }}
              items={ufs.map((uf) => ({ label: uf, value: uf }))}
              Icon={() => {
                return (
                  <View style={{ paddingTop: 16 }}>
                    <Icon name="arrow-down" size={20} color="gray" />
                  </View>
                );
              }}
            />
          </View>
          <View style={styles.picker}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCity(value)}
              placeholder={{ label: "Selecione uma cidade..." }}
              items={cities.map((city) => ({ label: city, value: city }))}
              Icon={() => {
                return (
                  <View style={{ paddingTop: 16 }}>
                    <Icon name="arrow-down" size={20} color="gray" />
                  </View>
                );
              }}
            />
          </View>

          <RectButton
            style={styles.button}
            onPress={() =>
              selectedUf && selectedCity && !loadingCities
                ? navigation.navigate("Points", {
                    uf: selectedUf,
                    city: selectedCity,
                  })
                : Alert.alert("Ooops...", "Preencha todos os campos a cima.")
            }
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    paddingTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    paddingTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },

  picker: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 16,
    paddingHorizontal: 8,
  },
});

export default Home;
