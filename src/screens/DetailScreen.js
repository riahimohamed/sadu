import React from 'react';
import { Text, View, FlatList, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ListItem } from "@react-native-material/core";
import * as MailComposer from 'expo-mail-composer';
import { FontAwesome } from '@expo/vector-icons';
import XLSX from 'xlsx';

import * as FileSystem from 'expo-file-system';


import Button from '../components/Button';
import { theme } from '../core/theme';
import BackButton from '../components/BackButton';

export default function DetailScreen({route, navigation}) {

  const obj = route.params;
  const body = JSON.stringify(obj.values).replace(/['"]+/g, '').slice(1, -1).replace(/[,]/g, '\n');
  let products = body;
              // +'\n'+
              //  JSON.stringify(obj.excel).replace(/['"]+/g, '').slice(1, -1).replace(/[{,]/g, '\n').replace(/[}]/g, '');
               
  let prod = JSON.stringify(obj.excel).replace(/['"]+/g, '').slice(1, -1).replace(/[{,]/g, '\n').replace(/[}]/g, '');
  
  let result = [
    {"Customer Name": Object.values(obj.values)[0],
    // "Customer Address": Object.values(obj.values)[1],
    // "Customer email": Object.values(obj.values)[2],
    // "Customer Tel": Object.values(obj.values)[3],
    // "Commercial name": Object.values(obj.values)[4],
    }
  ];

  // Object.keys(obj.excel).map(key => ({[key]: result.push(obj.excel[key])}));

  var ws = XLSX.utils.json_to_sheet(result, 
                  {header:["Customer Name",
                          //  "Customer Address",
                          //  "Customer email",
                          //  "Customer Tel",
                          //  "Commercial name"
                          ]});

  XLSX.utils.sheet_add_json(ws,
    obj.excel
  ,{skipHeader: false, origin: "F1"});

  var wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Commercial");
  const wbout = XLSX.write(wb, {
    type: 'base64',
    bookType: "xlsx"
  });
  
  const uri = FileSystem.cacheDirectory + 'commercial.xlsx';

  FileSystem.writeAsStringAsync(uri, wbout, {
    encoding: FileSystem.EncodingType.Base64
  });

  const list = [
    "Customer name",
    // "Customer Address",
    // "Customer email",
    // "Customer tel",
    // "Commercial name",
  ];

  const renderItem = ({ item, index }) => (
    <ListItem title={list[index]+': '+item} />
  );

  const renderItemData = ({ item }) => (
    <ListItem title={item}  />
  );

  const handleEmail = () => {
    navigation.push('Commands');

    const to = ['anja@sadu.be']
    MailComposer.composeAsync({
      recipients: 
      to,
      subject:  'Customer Command',
      body: products,
      attachments: [uri]
    });
  }
  
  return (
    <SafeAreaView style={Styles.container}>

      <BackButton goBack={navigation.goBack} />

      {/* <View style={Styles.textbox}>
       <Text style={Styles.text}>{prod}</Text>
      </View> */}
      <FlatList
        data={Object.values(obj.values)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <View style={{ marginBottom: 50, paddingHorizontal: 50 }}>
        <Button title="Send Mail" onPress={handleEmail} trailing={props => <FontAwesome name="send" size={24} color="white" />}  />
      </View>
    </SafeAreaView>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
    marginTop: 50
  },
  item: {
    backgroundColor: '#fff',
    // padding: 4,
    marginVertical: 4,
    marginHorizontal: 16,
  },
  title: {
    padding: 2,
    fontSize: 18,
  },
  badget: {
    padding: 3,
    backgroundColor: theme.colors.primary ,
    borderRadius: 20,
    color: "#fff"
  },
  textbox: {
    backgroundColor: '#fff',
    padding: 10,
    paddingHorizontal: 14,
    marginVertical: 25
  },
 text: {
   color: '#000',
   fontSize: 16,
   fontWeight: '700'
 }
})
