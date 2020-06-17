import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamDataService {
  private data = [];
  
  constructor() { }

  setData(data){
    this.data[this.getNextId()] = data;
  }

  getData(id){
    return this.data[id];
  }

  getDataLastId(){
    return this.data[this.getLastId()];
  }

  getNextId(){
    return this.data.length + 1;
  }

  getLastId(){
    return this.data.length -1;
  }
}
