import 'dart:convert';
import 'dart:core';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'model/horaires_model.dart';
import 'model/metro_model.dart';
import 'model/restaurant_model.dart';

class DataService{

  final allRestaurants = FirebaseFirestore.instance.collection("Restaurants");
  final allMetros = FirebaseFirestore.instance.collection("Metro");
  final allHoraires = FirebaseFirestore.instance.collection("Horaires");
  late List<RestaurantModel> restaurants = [];
  late List<HorairesModel> horaires = [];
  late List<MetroModel> metros = [];

  Future<void> setData() async{
    QuerySnapshot querySnapshot = await allRestaurants.get();
    for(int i = 0; i < querySnapshot.docs.length; i++){
      if(querySnapshot.docs[i].exists){
        Map<String, dynamic> a = querySnapshot.docs[i].data()! as Map<String, dynamic>;
        var positif = List<String>.from(a["positif"]);
        var negatif = List<String>.from(a["negatif"]);
        var r = RestaurantModel(ambiance: a["ambiance"],
          arrondissement: a["arrondissement"],id: a["id"],name: a["name"],
          price: a["price"],note: a["note"],img: a["img"],comment: a["comment"],
          tested: a["tested"], positif: positif, negatif: negatif,
          plat: a["plat"], theFork: a["theFork"], note_deco: a["note_deco"].toDouble(), priority: a["priority"].toDouble()
        );
        restaurants.add(r);
      } 
    }

    querySnapshot = await allHoraires.get();
    for(int i = 0; i < querySnapshot.docs.length; i++){
      if(querySnapshot.docs[i].exists){
        Map<String, dynamic> a = querySnapshot.docs[i].data()! as Map<String, dynamic>;
        horaires.add(HorairesModel(id: a["id"],
          lundi: List<String>.from(a["lundi"]),mardi: List<String>.from(a["mardi"]),mercredi: List<String>.from(a["mercredi"]),
          jeudi: List<String>.from(a["jeudi"]),vendredi: List<String>.from(a["vendredi"]),samedi: List<String>.from(a["samedi"]),dimanche: List<String>.from(a["dimanche"])
        ));
      } 
    }

    querySnapshot = await allMetros.get();
    for(int i = 0; i < querySnapshot.docs.length; i++){
      if(querySnapshot.docs[i].exists){
        Map<String, dynamic> a = querySnapshot.docs[i].data()! as Map<String, dynamic>;
        metros.add(MetroModel(Stations: List<String>.from(a["Stations"]), ligne: a["ligne"]));
      } 
    }

    restaurants.forEach((element) {
      var hor = horaires.where((e) => e.id == element.id);
      element.horaires = hor;
    });
  }

  getRestaurants(){
    return restaurants;
  }

  DataService();
}