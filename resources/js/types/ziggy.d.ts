// resources/js/types/ziggy.d.ts
declare module 'ziggy-js' {
  interface ZiggyRoute {
    uri: string;
    methods: string[];
    domain?: string | null;
  }

  interface ZiggyConfig {
    url: string;
    port?: number | null;
    defaults?: Record<string, unknown>;
    routes: Record<string, ZiggyRoute>;
  }

  type Primitive = string | number | boolean | null | undefined;
  type ParamValue = Primitive | Primitive[] | Record<string, Primitive | Primitive[]>;
  type Params = ParamValue | Record<string, ParamValue>;

  /**Aquí definimos `route` como export nombrado */
  export function route(
    name: string,
    params?: Params,
    absolute?: boolean,
    config?: ZiggyConfig
  ): string;
}
