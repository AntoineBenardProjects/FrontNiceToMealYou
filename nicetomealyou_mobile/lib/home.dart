import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:nicetomealyou_mobile/model/horaires_model.dart';
import 'package:nicetomealyou_mobile/model/restaurant_model.dart';
import 'main.dart';
import 'model/metro_model.dart';

class Home extends StatefulWidget {
  @override
  State<Home> createState() => _Home();
}

class _Home extends State<Home> {
  // ignore: prefer_typing_uninitialized_variables
  late var best;
  test(e){
    print(e);
  }
  setBest(List<RestaurantModel> allRestaurants){
    allRestaurants.sort((a,b) {
      double plus = 0;
      double moins = 0;
      if(a.note == "")  plus = 0;
      else  plus = double.parse(a.note);
      if(b.note == "")  moins = 0;
      else  moins = double.parse(b.note);
      
      var toReturn = 0;
      if(plus > moins)  toReturn = -1;
      else if(plus < moins) toReturn = 1;

      return toReturn;
    });
    best = allRestaurants;
    best.removeRange(5, best.length);
  }
  
  @override
  Widget build(BuildContext context) {
    final restaurants = ModalRoute.of(context)!.settings.arguments as List<RestaurantModel>;
    setBest(restaurants);
    return Scaffold(
      appBar: PreferredSize(
          preferredSize: const Size.fromHeight(kToolbarHeight),
          child: MyAppBar()
      ),
      drawer: MyDrawer(),
      body:
      ListView(
        shrinkWrap: true,  
        physics: const ClampingScrollPhysics(),
        children: [
          Container(
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height - 80,
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage("assets/home.jpg"),
                fit: BoxFit.cover
              )
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 300,
                  alignment: Alignment.center,
                  color: Colors.white,
                  child: TextField(
                    onSubmitted: ((value) async {
                      await showDialog(context: context, 
                        builder: (BuildContext context) {
                          return AlertDialog(
                            title: const Text("Thanks"),
                            content: Text("${value} de ${value.characters.length}"),
                            actions: <Widget>[
                              TextButton(onPressed: () {
                                Navigator.pop(context);
                              }, child: const Text("ok"))
                            ],
                          );
                        }
                      );
                    }),
                  ),
                )
              ],
            )
          ),
          ListView.builder(
            padding: const EdgeInsets.all(5.5),
            itemCount: best.length,
            itemBuilder: _itemBuilder,
          )
        ],
      ),
    );
  }


  Widget _itemBuilder(BuildContext context, int index) {
    return InkWell(
      child: Card(
        child: Center(
          child: Text(
            "${best[index].name}",
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.orange,
            ),
          ),
        ),
      ),
      onTap: () {},
    );
  }
}