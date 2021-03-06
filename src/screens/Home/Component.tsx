import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { getAllPokemon, getAllType } from "../../redux/actions";
import { Reducers } from "../../redux/types";
import { COLORS } from "../../configs";

import styles from "./styles";

const Component = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [activeType] = useState("all");
  const homeState = useSelector((state: Reducers) => state.home);

  useEffect(() => {
    dispatch(getAllPokemon());
    dispatch(getAllType());
  }, [dispatch]);

  const _renderLoading = useCallback(
    (size: "large" | "small" = "large") => (
      <View style={styles.wrapLoading}>
        <ActivityIndicator size={size} color={COLORS.black01} />
      </View>
    ),
    []
  );

  const _getId = useCallback(
    (url: string) => homeState.listPokemon.findIndex((e) => e.url === url) + 1,
    [homeState.listPokemon]
  );

  const _renderItem = useCallback(
    ({ item }: { item: any }) => {
      const color = COLORS as any;

      return (
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Detail", { url: item.url })}
            style={[
              styles.card,
              {
                backgroundColor: color[item.types && item.types[0].type.name],
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.wrapTitle}>
                <Text>{`${String(_getId(item.url))}`}</Text>
                <Text style={styles.marginLeft}>{item.name}</Text>
              </View>
              <View style={styles.wrapTitle}>
                {item.isLoading === undefined || item.isLoading ? (
                  <View style={styles.wrapTypeName}>
                    <Text>Loading...</Text>
                  </View>
                ) : (
                  <>
                    {item.types &&
                      item.types.map((res: any, ind: number) => (
                        <View style={styles.wrapTypeName}>
                          <Text>{res.type.name}</Text>
                        </View>
                      ))}
                  </>
                )}
              </View>
            </View>
            <View style={styles.wrapImage}>
              {item.isLoading === undefined || item.isLoading ? (
                _renderLoading("small")
              ) : (
                <Image
                  style={styles.image}
                  source={{
                    uri:
                      item.sprites &&
                      item.sprites.other["official-artwork"].front_default,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [_getId, _renderLoading, navigation]
  );

 

  const _dataPokemon = useCallback(() => {
    if (activeType === "all") {
      // console.log('homeState.listPokemon ======================================='+ JSON.stringify(homeState.listPokemon));
      return homeState.listPokemon;
    }
    return homeState.listPokemon.filter(
      (item) =>
        item.types.findIndex((e: any) => e.type.name === activeType) >= 0
    );
  }, [activeType, homeState.listPokemon]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <View style={styles.wrapHeader}>
        <Text style={styles.textHeader}>Pokemon Zappts</Text>
      </View>

      {!homeState.isLoadingPokemon ? (
        <FlatList
          data={_dataPokemon()}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItem}
          
        />
      ) : (
        _renderLoading()
      )}
    </View>
  );
};

export default Component;
