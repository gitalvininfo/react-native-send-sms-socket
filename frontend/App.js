import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import io from "socket.io-client";
import * as SMS from 'expo-sms';
// Replace this URL with your own socket-io host, or start the backend locally
const socketEndpoint = "http://192.168.43.144:3000";

export default function App() {
  const [hasConnection, setConnection] = useState(false);
  const [time, setTime] = useState(null);

  const [smsServiceAvailable, setSmsServiceAvailable] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(['09456980302, 09303896632']);
  const [message, setMessage] = useState('you have appointment');

  const socket = io(socketEndpoint, {
    transports: ["websocket"],
  });

  useEffect(function didMount() {

    checkIfServiceAvailable();

    socket.io.on("open", () => setConnection(true));
    socket.io.on("close", () => setConnection(false));

    socket.on("time-msg", (data) => {
      setTime(new Date(data.time).toString());
      onComposeSms();
      console.log('time msg')
    });

    return function didUnmount() {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  const pressMe = () => {
    socket.emit("press", { value: "from mobile" })
  }

  const checkIfServiceAvailable = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      setSmsServiceAvailable(true);
    }
  };

  const onComposeSms = async () => {
    console.log(smsServiceAvailable && phoneNumber && message)
    if (smsServiceAvailable && phoneNumber && message) {
      await SMS.sendSMSAsync(phoneNumber.toString(), message);
    }
  };

  return (
    <View style={styles.container}>
      {!hasConnection && (
        <>
          <Text style={styles.paragraph}>
            Connecting to {socketEndpoint}...
          </Text>
          <Text style={styles.footnote}>
            Make sure the backend is started and reachable hello
          </Text>
        </>
      )}

      {hasConnection && (
        <>
          {/* <View style={{ flex: 1, paddingVertical: 50 }}>
            {smsServiceAvailable ? (
              <View style={styles.formController}>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={text => setPhoneNumber(text)}
                  keyboardType='number-pad'
                  placeholder='Enter phone number here'
                />
                <TextInput
                  style={styles.input}
                  value={message}
                  onChangeText={text => setMessage(text)}
                  keyboardType='default'
                  placeholder='Enter message here'
                />
                <Button title="hello"></Button>
              </View>
            ) : (
              <Text>No SMS service available.</Text>
            )}
          </View> */}
          <Text style={[styles.paragraph, { fontWeight: "bold", marginTop: 100 }]}>
            Server time
          </Text>
          <Text style={styles.paragraph}>{time}</Text>
          <Button onPress={onComposeSms} title="Send SMS"></Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingVertical: 50
  },
  formController: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center'
  },
  input: {
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    paddingHorizontal: 10
  }
});
