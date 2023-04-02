import 'dart:core';

import 'package:nicetomealyou_mobile/model/horaires_model.dart';

class RestaurantModel{

  @override toString() {
    return 'User: $id, $name';
  }

  String id = "";
  String name = "";
  String price = "";
  String note = "";
  String arrondissement = "";
  String img = "";
  String comment = "";
  String plat = "";
  String theFork = "";
  String ambiance = "";
  bool tested = false;
  bool like = false;
  List<String> positif = [];
  List<String> negatif = [];
  Object horaires = Object();
  // ignore: non_constant_identifier_names
  double note_deco = 0;
  double priority = 0;

  RestaurantModel({required id, required name, required price, required note, required arrondissement, required img, required comment, required plat, required theFork, required ambiance, required tested, required positif, required negatif, required note_deco, required priority}){
    this.id = id;
    this.name = name;
    this.price = price;
    this.note = note;
    this.arrondissement = arrondissement;
    this.name = name;
    this.img = img;
    this.comment = comment;
    this.plat = plat;
    this.theFork = theFork;
    this.id = id;
    this.ambiance = ambiance;
    this.positif = positif;
    this.negatif = negatif;
    this.note_deco = note_deco;
    this.priority = priority;
  }
}