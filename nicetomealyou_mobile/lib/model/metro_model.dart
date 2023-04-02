import 'dart:core';

class MetroModel{
  // ignore: non_constant_identifier_names
  List<String> Stations = [];
  String ligne = "";

  // ignore: non_constant_identifier_names
  MetroModel({required Stations,required ligne}){
    this.Stations = Stations;
    this.ligne = ligne;
  }

}