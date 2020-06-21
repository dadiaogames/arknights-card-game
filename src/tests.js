var tests = {
  testBlock(G, ctx) {
      G.field = [
        {"name": "克洛丝", "atk":3, "hp":1},
        {"name": "米格鲁", "block":2, "atk":0, "hp":5},
        {"name": "玫兰莎", "block": 1, "atk":2, "hp":3},
      ];
      G.efield = [
        {"name": "小兵", "atk": 2, "hp":3},
        {"name": "小兵", "atk": 2, "hp":3},
        {"name": "小兵", "atk": 2, "hp":3},
        {"name": "小兵", "atk": 2, "hp":3},
        {"name": "小兵", "atk": 2, "hp":3},
        {"name": "小兵", "atk": 2, "hp":3},
      ];

      console.log("Testing blocks");
      console.log(get_blocker(G, ctx, 0).name);
      console.log(get_blocker(G, ctx, 1).name);
      console.log(get_blocker(G, ctx, 2).name);

      console.log("Testing damage");
      deal_damage(G, ctx, "efield", 0, 4);
      deal_damage(G, ctx, "efield", 1, 2);
      console.log(G.efield.length);

      console.log("Testing fight, let fight(0,0)");
      console.log("Testing enemy move, let 0 and 3 move");

    },

    testAddTag(G, ctx) {
      let tags = [
        {
          name: "源石活性",
          effect(G, ctx) {
            for (let e of G.edeck) {
              e.hp += 2;
            }
          }
        },
        {
          name: "最后防线",
          effect(G, ctx) {
            G.max_danger -= 2;
          }
        },
      ];

      add_tags(G, ctx,tags);
    },

};