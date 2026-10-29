'use client';
import {useEffect,useState} from 'react';
import {readProductDirectory} from '../lib/product-directory.mjs';
export function useProductDirectory(){
 const [rows,setRows]=useState([]),[state,setState]=useState('loading');
 useEffect(()=>{let live=true;const refresh=()=>readProductDirectory().then(rows=>{if(live){setRows(rows);setState('ready');}}).catch(()=>{if(live){setRows([]);setState('error');}});refresh();window.addEventListener('focus',refresh);const timer=setInterval(refresh,60000);return()=>{live=false;clearInterval(timer);window.removeEventListener('focus',refresh);};},[]);
 return {rows,state};
}
