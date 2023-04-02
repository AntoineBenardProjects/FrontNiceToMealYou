import 'package:flutter/material.dart';
import 'package:nicetomealyou_mobile/data_service.dart';
import 'package:nicetomealyou_mobile/home.dart';
import 'package:nicetomealyou_mobile/login.dart';
import 'package:nicetomealyou_mobile/restaurants.dart';
import 'package:nicetomealyou_mobile/shared.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSwatch().copyWith(
          primary: Colors.white,
          secondary: Colors.black
        )
      ),
      home: Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(kToolbarHeight),
          child: MyAppBar()
        ) ,
        drawer: MyDrawer(),
      ),
    );
  }
}

class MyDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          Container(
            alignment: Alignment.center,
            height: 100,
            width: MediaQuery.of(context).size.width,
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage("assets/menu_burger_img.jpg"),
                fit: BoxFit.cover
              )
            ),
            child: const Text(
              'Choisir un lieu',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
              ),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.local_restaurant),
            title: const Text('Restaurant',style: TextStyle(fontSize: 16)),
            onTap: () {
              Navigator.push(context,MaterialPageRoute(builder: (context)=>Restaurant()) );
            },
          ),
          ListTile(
            leading: const Icon(Icons.local_bar),
            title: const Text('Bar',style: TextStyle(fontSize: 16)),
            onTap: () {
              Navigator.push(context,MaterialPageRoute(builder: (context)=>Restaurant()) );
            },
          ),
          ListTile(
            leading: const Icon(Icons.local_activity),
            title: const Text('Activité',style: TextStyle(fontSize: 16)),
            onTap: () {
              Navigator.push(context,MaterialPageRoute(builder: (context)=>Restaurant()));
            },
          ),
          ListTile(
            leading: const Icon(Icons.close),
            title: const Text(
              'Fermer',style: TextStyle(fontSize: 16)
            ),
            onTap: () {
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}

class MyAppBar extends StatefulWidget {
  @override
  State<MyAppBar> createState() => _MyAppBar();
}

class _MyAppBar extends State<MyAppBar> {
  DataService dataService = DataService();
  test(List e){
    e.forEach((element) {
      print(element.toString());
    });
  }
  @override
  Widget build(BuildContext context) {
    dataService.setData();
    return AppBar(
      automaticallyImplyLeading: false,
      title: Table(
        children: [
          TableRow(
            children: [
              Container(
                alignment: Alignment.centerLeft,
                height: MediaQuery.of(context).size.height,
                child: Builder(
                  builder: (BuildContext context) {
                    return IconButton(
                      icon: const Icon(
                        Icons.menu,
                        color: Colors.black, // Change Custom Drawer Icon Color
                      ),
                      onPressed: () {
                        Scaffold.of(context).openDrawer();
                      },
                      tooltip: MaterialLocalizations.of(context).openAppDrawerTooltip,
                    );
                  },
                ),
              ),
              SizedBox(
                height: MediaQuery.of(context).size.height,
                child: const Image(
                  image: AssetImage('assets/logo.PNG')
                ),
              ),
              Container(
                height: MediaQuery.of(context).size.height,
                alignment: Alignment.centerRight,
                child: MaterialButton(
                  onPressed: (){
                    Navigator.push(context,MaterialPageRoute(builder: (context)=>Home(),settings: RouteSettings(arguments: dataService.getRestaurants())), );
                  },
                  child: const Icon(
                    Icons.home,
                    color: Colors.black,
                  ),
                ) ,
              ),
            ]
          )
        ],
      )
    );
  }
}
