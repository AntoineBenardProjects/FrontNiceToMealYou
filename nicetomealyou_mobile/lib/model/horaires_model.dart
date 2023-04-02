import 'dart:core';

class HorairesModel{
  String id = "";
  List<String> lundi = [];
  List<String> mardi = [];
  List<String> mercredi = [];
  List<String> jeudi = [];
  List<String> vendredi = [];
  List<String> samedi = [];
  List<String> dimanche = [];

  HorairesModel({required id, required lundi, required mardi, required mercredi, required jeudi, required vendredi, required samedi, required dimanche}){
    this.id = id;
    this.lundi = lundi;
    this.mardi = mardi;
    this.mercredi = mercredi;
    this.jeudi = jeudi;
    this.vendredi = vendredi;
    this.samedi = samedi;
    this.dimanche = dimanche;
  }

}