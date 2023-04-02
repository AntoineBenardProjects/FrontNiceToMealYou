import 'package:flutter/material.dart';
import 'package:nicetomealyou_mobile/main.dart';
import 'package:nicetomealyou_mobile/shared.dart';

class Login extends StatefulWidget {

  @override
  State<Login> createState() => _Login();
}

class _Login extends State<Login> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
          preferredSize: const Size.fromHeight(kToolbarHeight),
          child: MyAppBar()
      ),
      
    );
  }
}