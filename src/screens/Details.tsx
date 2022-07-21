import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Box, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { CircleWavyCheck, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button } from '../components/Button';
import { CardDetails } from '../components/CardDetails';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { OrderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string
  solucion: string
  closed: string
}

export function Details() {

  const [isloading, setIsLoading] = useState(true)
  const [solucion, setSolucion] = useState('')
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)

  const route = useRoute()
  const { orderId } = route.params as RouteParams

  const navigation = useNavigation()

  const { colors } = useTheme()

  function handleOrderClose() {
    if (!solucion) {
      return Alert.alert('Solicitação', 'Informe  a solução para encerrar a solicitação')
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solucion,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Solicitação', 'Solicitação encerrada')
        navigation.goBack()
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Solicitação', 'Não foi possível encerrar a solicitação')
      })
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId).get()
      .then((doc) => {
        const { patrimony, description, status, created_at, closed_at, solucion } = doc.data()

        const closed = closed_at ? dateFormat(closed_at) : null

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solucion,
          when: dateFormat(created_at),
          closed
        })

        setIsLoading(false)
      })


  }, [])

  if (isloading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>
      {isloading ? <Loading /> :
        <HStack bg="gray.500" justifyContent="center" p={4}>
          {order.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass color={colors.secondary[700]} />
          }
          <Text
            color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
            ml={2}
            textTransform="uppercase"
          >
            {order.status === 'closed' ? 'finalizado' : 'em andamento'}
          </Text>

        </HStack>
      }
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          
        />

        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          description={order.solucion}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === 'open' &&

            <Input
              placeholder='Descrição da solução'
              onChangeText={setSolucion}
              textAlignVertical="top"
              multiline
              h={24}
            />
          }
        </CardDetails>
      </ScrollView>

      {
        order.status === 'open' &&
        <Button
          title='Encerrar solicitação'
          m={5}
          onPress={handleOrderClose}
        />
      }
    </VStack>

  );
}