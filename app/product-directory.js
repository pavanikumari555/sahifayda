'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {readProductDirectory} from '../lib/product-directory.mjs';
export function useProductDirectory(){
 const [rows,setRows]=useState([]),[state,setState]=useState('loading');
 const live=useRef(true);
 const refresh=useCallback(()=>readProductDirectory().then(rows=>{if(live.current){setRows(rows);setState('ready');}return rows;}).catch(()=>{if(live.current){setRows([]);setState('error');}return null;}),[]);
 useEffect(()=>{live.current=true;refresh();window.addEventListener('focus',refresh);const timer=setInterval(refresh,60000);return()=>{live.current=false;clearInterval(timer);window.removeEventListener('focus',refresh);};},[refresh]);
 return {rows,state,refresh};
}
