import React, { useCallback } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";

import { COLORS } from "../../configs";
import { Reducers } from "../../redux/types";

import styles from "./styles";

let indexCompare: number;
let dataCompare: any;
let backgroundColorCompare: string;

const Component = () => {
  const color = COLORS as any;
  const navigation = useNavigation();
  const { params } = useRoute();
  const { url, urlCompare } = params as any;

  const homeState = useSelector((state: Reducers) => state.home);
  const index = homeState.listPokemon.findIndex((e) => e.url === url);
  const data = homeState.listPokemon[index];
  const backgroundColor = color[data.types[0].type.name];

  if (urlCompare) {
    indexCompare = homeState.listPokemon.findIndex((e) => e.url === urlCompare);
    dataCompare = homeState.listPokemon[indexCompare];
    backgroundColorCompare = color[dataCompare.types[0].type.name];
  }

  const _getWidth = useCallback(
    (value: number, maxValue: number) => (value / maxValue) * 100,
    []
  );

  const _getMaxStats = useCallback(
    (listStats: any[]) => Math.max(...listStats.map((e: any) => e.base_stat)),
    []
  );

  const _renderHeader = useCallback(
    (item: any, id: string) => (
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.wrapTitle}>
            <Text>{id}</Text>
            <Text style={styles.marginLeft}>{item.name}</Text>
          </View>
          <View style={styles.wrapTitle}>
            {item.types.map((res: any, ind: number) => (
              <View key={ind} style={styles.wrapTypeName}>
                <Text>{res.type.name}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.wrapImage}>
          <Image
            style={styles.image}
            source={{
              uri: item.sprites.other["official-artwork"].front_default,
            }}
          />
        </View>
      </View>
    ),
    []
  );

  const _renderStats = useCallback(
    (item: any, ind: number, maxStats: number, background: string) => (
      <View key={ind} style={styles.wrapItemStats}>
        <Text style={{ width: "35%" }}>{item.stat.name}</Text>
        <View style={styles.wrapSizeStats}>
          <View
            style={[
              styles.sizeStats,
              {
                backgroundColor: background,
                width: `${_getWidth(item.base_stat, maxStats)}%`,
              },
            ]}
          />
          <Text
            style={{
              width: "10%",
              textAlign: "right",
              marginLeft: "2%",
            }}
          >
            {item.base_stat}
          </Text>
        </View>
      </View>
    ),
    [_getWidth]
  );
  const _renderCaract = useCallback(
    (item: any, maxStats: number, background: string) => (
      <View style={styles.wrapItemStats}>
        {/* <Text style={{ width: "35%" }}>{item.stat.name}</Text> */}
 


        <View style={styles.wrapSizeStats}>
          <View
            style={[
              styles.sizeStats,
              {
                backgroundColor: background,
                width: `${_getWidth(item.base_stat, maxStats)}%`,
              },
            ]}
          />
          <Text
            // style={{
            //   width: "10%",
            //   textAlign: "right",
            //   marginLeft: "2%",
            // }}
          >
            Peso:{item.weight}

          </Text>
        </View>


        <View style={styles.wrapSizeStats}>
          <View
            style={[
              styles.sizeStats,
              {
                backgroundColor: background,
                width: `${_getWidth(item.base_stat, maxStats)}%`,
              },
            ]}
          />
          <Text
            // style={{
            //   width: "10%",
            //   textAlign: "right",
            //   marginLeft: "2%",
            // }}
          >
      
            Altura:{item.height}

          </Text>
        </View>
      </View>
    ),
    [_getWidth]
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={backgroundColor} />

      <ScrollView style={{ backgroundColor }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.buttonBack}
        >
          <Text>Back</Text>
        </TouchableOpacity>
        <>
          {_renderHeader(data, `#${String(index + 1).padStart(4, "0")}`)}

          {/* nome, foto, tipo(s), peso (em kg) e altura (em metros). */}
          <View style={styles.body}>
            <View style={styles.wrapCard}>
              <Text>Caractetiricas</Text>
              <View style={styles.card}>
                {_renderCaract(
                    data,
                    // ind,
                    _getMaxStats(data.stats),
                    backgroundColor
                  )}
              </View>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.wrapCard}>
              <Text>Stats</Text>
              <View style={styles.card}>
                {data.stats.map((item: any, ind: number) =>
                  _renderStats(
                    item,
                    ind,
                    _getMaxStats(data.stats),
                    backgroundColor
                  )
                )}
              </View>
            </View>
          </View>
        </>
      </ScrollView>
    </View>
  );
};

export default Component;
