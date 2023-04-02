import 'package:flutter/material.dart';
import 'package:nicetomealyou_mobile/main.dart';

class Restaurant extends StatefulWidget {
  @override
  State<Restaurant> createState() => _Restaurant();
}

class _Restaurant extends State<Restaurant> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
          preferredSize: const Size.fromHeight(kToolbarHeight),
          child: MyAppBar()
      ),
      drawer: MyDrawer(),
    );
  }
}