import React, { useEffect, useState } from 'react'
import { RefreshControl, View, Text, TouchableOpacity, TouchableHighlight,
    AccessibilityInfoButton, SafeAreaView, ScrollView, Dimensions, StyleSheet, Image } from 'react-native'
import { observer } from 'mobx-react'
import root from '../../store/Root'
import Page from '../../components/ui/Page'
import { colors, lists } from '../../components/ui/theme'
import { FlatList } from 'react-native-gesture-handler'
import { NoData } from "../../components/NoData";
import { FilterTabBar } from '../../components/FilterTabBar'
import { Loading } from '../../components/Loading'
import {formatMoney} from "../../helpers/utils";
import {SingleTextInput} from "../../components/SingleTextInput";

export const SelectCustomerScreen = observer(({ navigation }) => {
    const [isLoaded, setLoaded] = useState(true)
    const [isShowFilter, setShowFilter] = useState(false)
    const [filter, onChangeFilter] = useState('');

    useEffect(() => {
        if (root.customersStore.customers.length === 0) {
            //get data fom API
            root.customersStore.get(root.authStore.token).then(setLoaded(false)).then(setLoaded(false))
        } else {
            setLoaded(false)
        }
        root.customersStore.setFilter('')
    }, []) //run only first time

    const pressFilter = () => {
        setShowFilter(true)
    }

    const getAddress = (city, state) => {
        let result = (city !== null && city !== '') ? city : ''
        if (result === ''){
            return
        }
        result += (state !== null && state !== '') ?
         ', ' + state
        : ''
        return result
    }

    const balance = (total, overdue) => {
        return formatMoney(total)
    }

    const selectCustomer = (item) => {
        root.salesOrderStore.setCurrentCustomer(item.CustomerId, item.Name)
        navigation.goBack(null)
    }

    const Item = ({ item }) => (
        <TouchableOpacity
            accessibilityRole="button"
            onPress={ () => selectCustomer(item) }
        >
            <View style={styles.item}>
                <View style={styles.itemRow}>
                    <View>
                        <Text numberOfLines={1} style={styles.name}>{item.Name}</Text>
                    </View>
                </View>
                <View style={styles.itemRow}>
                    <View>
                        <Text numberOfLines={1} style={styles.address}>{getAddress(item.City, item.State)}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text>{balance(item.TotalBalance, item.OverdueBalance)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderItem = (data, rowMap) => (
        <Item item={data.item} />
    )

    const returnFilter = (filter) => {
        onChangeFilter(filter)
        setShowFilter(false)
        root.customersStore.setFilter(filter)
    }

    return (        
            <Page
                headerTitle='Select Customer'
                navigation={navigation}
                tabBar={<FilterTabBar navigation={navigation} pressFilter={pressFilter}/>}
            >
            {
                isLoaded ?
                    <Loading />
                    :
                    <>
                    {root.customersStore.customers.length === 0 ?
                            <NoData />
                            :
                            <>
                            <FlatList
                                data={root.customersStore.getCustomers}
                                initialNumToRender={15}
                                renderItem={renderItem}
                                keyExtractor={item => item.CustomerId}
                            />

                            {
                                isShowFilter ?
                                    <SingleTextInput textState={filter} pressButton={returnFilter} placeholder={'Filter'} />
                                    :
                                    <></>
                            }
                            </>
                    }
                    </>
            }
            </Page>
    )
})

const styles = StyleSheet.create({
    item: {
        backgroundColor: colors.backgroundItemList,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 4,
        paddingBottom: 4,
        borderBottomWidth: 0.5
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 20
    },
    address: {
        fontSize: 14
    }
})