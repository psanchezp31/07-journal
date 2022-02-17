import daybookRouter from "@/modules/daybook/router";

describe("pruebas en el router module de daybook", () => {
  test("el router debe de tener esta configuración ", async () => {
    expect(daybookRouter).toMatchObject({
      name: "daybook",
      component: expect.any(Function),
      children: [
        {
          path: "",
          name: "no-entry",
          component: expect.any(Function),
        },
        {
          path: ":id",
          name: "entry",
          component: expect.any(Function),
          props: expect.any(Function),
        },
      ],
    });

    // expect((await daybookRouter.children[0].component()).default.name).toBe('NoEntrySelected') //el await es para esperar que se cargue el componente, ya que en el router están cargados como lazy loading
    // //en esta aserción se espera que el children tenga como primer objeto al no entry selected
    // expect((await daybookRouter.children[1].component()).default.name).toBe('EntryView')

    const promiseRoutes = [];
    daybookRouter.children.forEach((child) => {
      promiseRoutes.push(child.component());
    });

    const routes = (await Promise.all(promiseRoutes)).map(
      (r) => r.default.name
    );
    console.log(routes);

    expect(routes).toContain("EntryView"); //se espera que el index router tenga al menos estos dos componentes
    expect(routes).toContain("NoEntrySelected");
  });

  test("debe de retornar el id de la ruta ", () => {
    const route = {
      params: {
        id: "ABC-123",
      },
    };

    // console.log(daybookRouter.children[1].props(route)); para comprobar que se reciba la ruta por parámetro
    // expect(daybookRouter.children[1].props(route)).toEqual({
    //   id: "ABC-123",
    // });

 //esta es otra opción, no quemando el children[en la posicion] sino buscando dentro del children el nombre del componente:
    const entryRoute = daybookRouter.children.find(
      (route) => route.name === "entry"
    );
    expect(entryRoute.props(route)).toEqual({
      id: "ABC-123",
    });
  });
});
