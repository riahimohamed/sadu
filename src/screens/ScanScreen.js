import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ImageBackground, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { HStack } from "@react-native-material/core";
import { FontAwesome } from '@expo/vector-icons';

import TextInput from '../components/TextInput';
import Button from '../components/Button';

import Products from '../assets/json/Products.json';

export default function ScanScreen({route, navigation}) {
  
  const values = route.params;

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState('');

  const [data, setData] = useState();

  const [excel, setexcel] = useState([]);
  const [exist, setExist] = useState(false);
  const [stock, setStock] = useState(false);
  const [product, steProduct] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {

    let prod = Products.filter(x => {return x.Barcode === parseInt(data)});

    setScanned(true);
    setModalVisible(true);

    if(prod.length !== 0){
      steProduct(prod);
      setExist(true);
      
      setData(data);
    }else{
      setExist(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleData = () => {

    if(product.length !== 0){
      // if(product[0].Stock >= parseInt(text)){
        // setStock(false);
        setexcel(excel);
        excel.push({ "Product Barcode": product[0].Barcode, "Product Name": product[0].Name, "Product Reference": product[0].Reference, "Product Quantity": text });
      // }else{
      //   setStock(true);
      // }
    }

    onChangeText('');
  }

  const details = () => {
    setScanned(false);
    setData(data);
    handleData();
    navigation.navigate("Details", {excel, values} )
  }

  return (
    <View style={styles.container}>
       
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && 
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* <Text style={styles.modalText}>Bar code with type ${type}</Text> */}
              {!exist && <Text style={styles.modalText}>This product not found!</Text>}
              {/* {stock && <Text style={styles.modalText}>Amount less then {text}</Text>} */}
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                name="amount"
                label="Quantity"
                keyboardType="numeric"
                onChangeText={onChangeText}
                value={text}
                editable={exist}
              />
              <HStack m={4} spacing={6}>
                <View style={styles.row}>
                  <Button 
                      title="Scan" 
                      trailing={props => <FontAwesome name="barcode" size={24} color="white" />} 
                      disable={text !== '' || !exist} 
                      onPress={() => {
                      handleData();
                      setScanned(false)}
                    } />
                  <Button title={'Pass command'} disable={text !== ''}  onPress={details} />
                </View>
              </HStack>
            </View>
          </View>
        </Modal>}

        { !scanned && <ImageBackground
          source={require('../assets/barcode.png')}
          resizeMode="contain"
          style={styles.bg}
          >
        </ImageBackground>}
        {/* <View style={{bottom: 20}}>
          <Button title={'Details'} onPress={details} />
        </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  bg:{
    flex: 1,
    justifyContent: 'center',
    // alignContent: 'center',
    width: 300,
  },
  button: {
    borderRadius: 2,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: 'red'
  }
})