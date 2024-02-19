//定义store
import { defineStore } from "pinia";
import {ref} from 'vue';

export const useCurrentUserDataStore= defineStore('currentUserData',()=>{
    const currentUserData =ref('')

    const setCurrentUserData= (newCurrentUserData)=>{
        currentUserData.value = newCurrentUserData
    }

    const removeCurrentUserData= ()=>{
        currentUserData.value = ''
    }

    return {
        currentUserData,setCurrentUserData,removeCurrentUserData
    }
},{
    persist: true//持久化存储
});
