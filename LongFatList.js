import React, { useEffect, useState, useMemo } from 'react'
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
        //ToDo logic Overdue?
        return formatMoney(total)
    }

    const selectCustomer = (item) => {
        root.salesOrderStore.setCurrentCustomer(item.CustomerId, item.Name)
        navigation.goBack(null)
    }

    const Item = ({ item }) => (
        <TouchableOpacity
            key={item.Id}
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

    const MemoItem = React.memo(Item)

    const renderItem = (data, rowMap) => (
        <MemoItem item={data.item}/>
        // <Item item={data.item} />
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
                    {(root.customersStore.getCustomers.length === 0) && (!isShowFilter) ?
                            <NoData />
                            :
                            <>
                            <FlatList
                                data={root.customersStore.getCustomers}
                                initialNumToRender={15}
                                renderItem={renderItem}
                                keyExtractor={item => item.CustomerId}
                                maxToRenderPerBatch={20}
                                removeClippedSubviews={true}
                                updateCellsBatchingPeriod={3000}
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