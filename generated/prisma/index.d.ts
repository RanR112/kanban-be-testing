
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Department
 * 
 */
export type Department = $Result.DefaultSelection<Prisma.$DepartmentPayload>
/**
 * Model RequestKanban
 * 
 */
export type RequestKanban = $Result.DefaultSelection<Prisma.$RequestKanbanPayload>
/**
 * Model Persetujuan
 * 
 */
export type Persetujuan = $Result.DefaultSelection<Prisma.$PersetujuanPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MANAGER: 'MANAGER',
  SUPERVISOR: 'SUPERVISOR',
  LEADER: 'LEADER',
  STAFF: 'STAFF'
};

export type Role = (typeof Role)[keyof typeof Role]


export const RequestStatus: {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED_BY_DEPARTMENT: 'APPROVED_BY_DEPARTMENT',
  PENDING_PC: 'PENDING_PC',
  APPROVED_BY_PC: 'APPROVED_BY_PC',
  REJECTED: 'REJECTED'
};

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus]


export const ApprovalRole: {
  LEADER: 'LEADER',
  SUPERVISOR: 'SUPERVISOR',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF'
};

export type ApprovalRole = (typeof ApprovalRole)[keyof typeof ApprovalRole]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type RequestStatus = $Enums.RequestStatus

export const RequestStatus: typeof $Enums.RequestStatus

export type ApprovalRole = $Enums.ApprovalRole

export const ApprovalRole: typeof $Enums.ApprovalRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.department`: Exposes CRUD operations for the **Department** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Departments
    * const departments = await prisma.department.findMany()
    * ```
    */
  get department(): Prisma.DepartmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.requestKanban`: Exposes CRUD operations for the **RequestKanban** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RequestKanbans
    * const requestKanbans = await prisma.requestKanban.findMany()
    * ```
    */
  get requestKanban(): Prisma.RequestKanbanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.persetujuan`: Exposes CRUD operations for the **Persetujuan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Persetujuans
    * const persetujuans = await prisma.persetujuan.findMany()
    * ```
    */
  get persetujuan(): Prisma.PersetujuanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Department: 'Department',
    RequestKanban: 'RequestKanban',
    Persetujuan: 'Persetujuan',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "department" | "requestKanban" | "persetujuan" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Department: {
        payload: Prisma.$DepartmentPayload<ExtArgs>
        fields: Prisma.DepartmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findFirst: {
            args: Prisma.DepartmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findMany: {
            args: Prisma.DepartmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          create: {
            args: Prisma.DepartmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          createMany: {
            args: Prisma.DepartmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DepartmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          update: {
            args: Prisma.DepartmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DepartmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          aggregate: {
            args: Prisma.DepartmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartment>
          }
          groupBy: {
            args: Prisma.DepartmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentCountAggregateOutputType> | number
          }
        }
      }
      RequestKanban: {
        payload: Prisma.$RequestKanbanPayload<ExtArgs>
        fields: Prisma.RequestKanbanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RequestKanbanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestKanbanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RequestKanbanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestKanbanPayload>
          }
          findFirst: {
            args: Prisma.RequestKanbanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestKanbanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RequestKanbanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestKanbanPayload>
          }
          findMany: {
            args: Prisma.RequestKanbanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestKanbanPayload>[]
          }
          create: {
            args: Prisma.RequestKanbanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestKanbanPayload>
          }
          createMany: {
            args: Prisma.RequestKanbanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RequestKanbanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestKanbanPayload>
          }
          update: {
            args: Prisma.RequestKanbanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestKanbanPayload>
          }
          deleteMany: {
            args: Prisma.RequestKanbanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RequestKanbanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RequestKanbanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RequestKanbanPayload>
          }
          aggregate: {
            args: Prisma.RequestKanbanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRequestKanban>
          }
          groupBy: {
            args: Prisma.RequestKanbanGroupByArgs<ExtArgs>
            result: $Utils.Optional<RequestKanbanGroupByOutputType>[]
          }
          count: {
            args: Prisma.RequestKanbanCountArgs<ExtArgs>
            result: $Utils.Optional<RequestKanbanCountAggregateOutputType> | number
          }
        }
      }
      Persetujuan: {
        payload: Prisma.$PersetujuanPayload<ExtArgs>
        fields: Prisma.PersetujuanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PersetujuanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersetujuanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PersetujuanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersetujuanPayload>
          }
          findFirst: {
            args: Prisma.PersetujuanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersetujuanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PersetujuanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersetujuanPayload>
          }
          findMany: {
            args: Prisma.PersetujuanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersetujuanPayload>[]
          }
          create: {
            args: Prisma.PersetujuanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersetujuanPayload>
          }
          createMany: {
            args: Prisma.PersetujuanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PersetujuanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersetujuanPayload>
          }
          update: {
            args: Prisma.PersetujuanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersetujuanPayload>
          }
          deleteMany: {
            args: Prisma.PersetujuanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PersetujuanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PersetujuanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PersetujuanPayload>
          }
          aggregate: {
            args: Prisma.PersetujuanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePersetujuan>
          }
          groupBy: {
            args: Prisma.PersetujuanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PersetujuanGroupByOutputType>[]
          }
          count: {
            args: Prisma.PersetujuanCountArgs<ExtArgs>
            result: $Utils.Optional<PersetujuanCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    department?: DepartmentOmit
    requestKanban?: RequestKanbanOmit
    persetujuan?: PersetujuanOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    requestKanban: number
    persetujuan: number
    notifications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requestKanban?: boolean | UserCountOutputTypeCountRequestKanbanArgs
    persetujuan?: boolean | UserCountOutputTypeCountPersetujuanArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRequestKanbanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequestKanbanWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPersetujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersetujuanWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type DepartmentCountOutputType
   */

  export type DepartmentCountOutputType = {
    users: number
    requestKanban: number
    persetujuan: number
  }

  export type DepartmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | DepartmentCountOutputTypeCountUsersArgs
    requestKanban?: boolean | DepartmentCountOutputTypeCountRequestKanbanArgs
    persetujuan?: boolean | DepartmentCountOutputTypeCountPersetujuanArgs
  }

  // Custom InputTypes
  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentCountOutputType
     */
    select?: DepartmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountRequestKanbanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequestKanbanWhereInput
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountPersetujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersetujuanWhereInput
  }


  /**
   * Count Type RequestKanbanCountOutputType
   */

  export type RequestKanbanCountOutputType = {
    persetujuan: number
    notifications: number
  }

  export type RequestKanbanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    persetujuan?: boolean | RequestKanbanCountOutputTypeCountPersetujuanArgs
    notifications?: boolean | RequestKanbanCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * RequestKanbanCountOutputType without action
   */
  export type RequestKanbanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanbanCountOutputType
     */
    select?: RequestKanbanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RequestKanbanCountOutputType without action
   */
  export type RequestKanbanCountOutputTypeCountPersetujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersetujuanWhereInput
  }

  /**
   * RequestKanbanCountOutputType without action
   */
  export type RequestKanbanCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id_users: number | null
    id_department: number | null
  }

  export type UserSumAggregateOutputType = {
    id_users: number | null
    id_department: number | null
  }

  export type UserMinAggregateOutputType = {
    id_users: number | null
    id_department: number | null
    name: string | null
    role: $Enums.Role | null
    email: string | null
    no_hp: string | null
    password: string | null
  }

  export type UserMaxAggregateOutputType = {
    id_users: number | null
    id_department: number | null
    name: string | null
    role: $Enums.Role | null
    email: string | null
    no_hp: string | null
    password: string | null
  }

  export type UserCountAggregateOutputType = {
    id_users: number
    id_department: number
    name: number
    role: number
    email: number
    no_hp: number
    password: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id_users?: true
    id_department?: true
  }

  export type UserSumAggregateInputType = {
    id_users?: true
    id_department?: true
  }

  export type UserMinAggregateInputType = {
    id_users?: true
    id_department?: true
    name?: true
    role?: true
    email?: true
    no_hp?: true
    password?: true
  }

  export type UserMaxAggregateInputType = {
    id_users?: true
    id_department?: true
    name?: true
    role?: true
    email?: true
    no_hp?: true
    password?: true
  }

  export type UserCountAggregateInputType = {
    id_users?: true
    id_department?: true
    name?: true
    role?: true
    email?: true
    no_hp?: true
    password?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id_users: number
    id_department: number
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_users?: boolean
    id_department?: boolean
    name?: boolean
    role?: boolean
    email?: boolean
    no_hp?: boolean
    password?: boolean
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    requestKanban?: boolean | User$requestKanbanArgs<ExtArgs>
    persetujuan?: boolean | User$persetujuanArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id_users?: boolean
    id_department?: boolean
    name?: boolean
    role?: boolean
    email?: boolean
    no_hp?: boolean
    password?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_users" | "id_department" | "name" | "role" | "email" | "no_hp" | "password", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    requestKanban?: boolean | User$requestKanbanArgs<ExtArgs>
    persetujuan?: boolean | User$persetujuanArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      department: Prisma.$DepartmentPayload<ExtArgs>
      requestKanban: Prisma.$RequestKanbanPayload<ExtArgs>[]
      persetujuan: Prisma.$PersetujuanPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id_users: number
      id_department: number
      name: string
      role: $Enums.Role
      email: string
      no_hp: string
      password: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id_users`
     * const userWithId_usersOnly = await prisma.user.findMany({ select: { id_users: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    department<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    requestKanban<T extends User$requestKanbanArgs<ExtArgs> = {}>(args?: Subset<T, User$requestKanbanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    persetujuan<T extends User$persetujuanArgs<ExtArgs> = {}>(args?: Subset<T, User$persetujuanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id_users: FieldRef<"User", 'Int'>
    readonly id_department: FieldRef<"User", 'Int'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly email: FieldRef<"User", 'String'>
    readonly no_hp: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.requestKanban
   */
  export type User$requestKanbanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    where?: RequestKanbanWhereInput
    orderBy?: RequestKanbanOrderByWithRelationInput | RequestKanbanOrderByWithRelationInput[]
    cursor?: RequestKanbanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequestKanbanScalarFieldEnum | RequestKanbanScalarFieldEnum[]
  }

  /**
   * User.persetujuan
   */
  export type User$persetujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    where?: PersetujuanWhereInput
    orderBy?: PersetujuanOrderByWithRelationInput | PersetujuanOrderByWithRelationInput[]
    cursor?: PersetujuanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PersetujuanScalarFieldEnum | PersetujuanScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Department
   */

  export type AggregateDepartment = {
    _count: DepartmentCountAggregateOutputType | null
    _avg: DepartmentAvgAggregateOutputType | null
    _sum: DepartmentSumAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  export type DepartmentAvgAggregateOutputType = {
    id_department: number | null
  }

  export type DepartmentSumAggregateOutputType = {
    id_department: number | null
  }

  export type DepartmentMinAggregateOutputType = {
    id_department: number | null
    name: string | null
  }

  export type DepartmentMaxAggregateOutputType = {
    id_department: number | null
    name: string | null
  }

  export type DepartmentCountAggregateOutputType = {
    id_department: number
    name: number
    _all: number
  }


  export type DepartmentAvgAggregateInputType = {
    id_department?: true
  }

  export type DepartmentSumAggregateInputType = {
    id_department?: true
  }

  export type DepartmentMinAggregateInputType = {
    id_department?: true
    name?: true
  }

  export type DepartmentMaxAggregateInputType = {
    id_department?: true
    name?: true
  }

  export type DepartmentCountAggregateInputType = {
    id_department?: true
    name?: true
    _all?: true
  }

  export type DepartmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Department to aggregate.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Departments
    **/
    _count?: true | DepartmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DepartmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DepartmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentMaxAggregateInputType
  }

  export type GetDepartmentAggregateType<T extends DepartmentAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartment[P]>
      : GetScalarType<T[P], AggregateDepartment[P]>
  }




  export type DepartmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithAggregationInput | DepartmentOrderByWithAggregationInput[]
    by: DepartmentScalarFieldEnum[] | DepartmentScalarFieldEnum
    having?: DepartmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentCountAggregateInputType | true
    _avg?: DepartmentAvgAggregateInputType
    _sum?: DepartmentSumAggregateInputType
    _min?: DepartmentMinAggregateInputType
    _max?: DepartmentMaxAggregateInputType
  }

  export type DepartmentGroupByOutputType = {
    id_department: number
    name: string
    _count: DepartmentCountAggregateOutputType | null
    _avg: DepartmentAvgAggregateOutputType | null
    _sum: DepartmentSumAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  type GetDepartmentGroupByPayload<T extends DepartmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_department?: boolean
    name?: boolean
    users?: boolean | Department$usersArgs<ExtArgs>
    requestKanban?: boolean | Department$requestKanbanArgs<ExtArgs>
    persetujuan?: boolean | Department$persetujuanArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>



  export type DepartmentSelectScalar = {
    id_department?: boolean
    name?: boolean
  }

  export type DepartmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_department" | "name", ExtArgs["result"]["department"]>
  export type DepartmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Department$usersArgs<ExtArgs>
    requestKanban?: boolean | Department$requestKanbanArgs<ExtArgs>
    persetujuan?: boolean | Department$persetujuanArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $DepartmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Department"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      requestKanban: Prisma.$RequestKanbanPayload<ExtArgs>[]
      persetujuan: Prisma.$PersetujuanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id_department: number
      name: string
    }, ExtArgs["result"]["department"]>
    composites: {}
  }

  type DepartmentGetPayload<S extends boolean | null | undefined | DepartmentDefaultArgs> = $Result.GetResult<Prisma.$DepartmentPayload, S>

  type DepartmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentCountAggregateInputType | true
    }

  export interface DepartmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Department'], meta: { name: 'Department' } }
    /**
     * Find zero or one Department that matches the filter.
     * @param {DepartmentFindUniqueArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentFindUniqueArgs>(args: SelectSubset<T, DepartmentFindUniqueArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Department that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentFindUniqueOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentFindFirstArgs>(args?: SelectSubset<T, DepartmentFindFirstArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Departments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Departments
     * const departments = await prisma.department.findMany()
     * 
     * // Get first 10 Departments
     * const departments = await prisma.department.findMany({ take: 10 })
     * 
     * // Only select the `id_department`
     * const departmentWithId_departmentOnly = await prisma.department.findMany({ select: { id_department: true } })
     * 
     */
    findMany<T extends DepartmentFindManyArgs>(args?: SelectSubset<T, DepartmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Department.
     * @param {DepartmentCreateArgs} args - Arguments to create a Department.
     * @example
     * // Create one Department
     * const Department = await prisma.department.create({
     *   data: {
     *     // ... data to create a Department
     *   }
     * })
     * 
     */
    create<T extends DepartmentCreateArgs>(args: SelectSubset<T, DepartmentCreateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Departments.
     * @param {DepartmentCreateManyArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentCreateManyArgs>(args?: SelectSubset<T, DepartmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Department.
     * @param {DepartmentDeleteArgs} args - Arguments to delete one Department.
     * @example
     * // Delete one Department
     * const Department = await prisma.department.delete({
     *   where: {
     *     // ... filter to delete one Department
     *   }
     * })
     * 
     */
    delete<T extends DepartmentDeleteArgs>(args: SelectSubset<T, DepartmentDeleteArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Department.
     * @param {DepartmentUpdateArgs} args - Arguments to update one Department.
     * @example
     * // Update one Department
     * const department = await prisma.department.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentUpdateArgs>(args: SelectSubset<T, DepartmentUpdateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Departments.
     * @param {DepartmentDeleteManyArgs} args - Arguments to filter Departments to delete.
     * @example
     * // Delete a few Departments
     * const { count } = await prisma.department.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentDeleteManyArgs>(args?: SelectSubset<T, DepartmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentUpdateManyArgs>(args: SelectSubset<T, DepartmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Department.
     * @param {DepartmentUpsertArgs} args - Arguments to update or create a Department.
     * @example
     * // Update or create a Department
     * const department = await prisma.department.upsert({
     *   create: {
     *     // ... data to create a Department
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Department we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentUpsertArgs>(args: SelectSubset<T, DepartmentUpsertArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentCountArgs} args - Arguments to filter Departments to count.
     * @example
     * // Count the number of Departments
     * const count = await prisma.department.count({
     *   where: {
     *     // ... the filter for the Departments we want to count
     *   }
     * })
    **/
    count<T extends DepartmentCountArgs>(
      args?: Subset<T, DepartmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentAggregateArgs>(args: Subset<T, DepartmentAggregateArgs>): Prisma.PrismaPromise<GetDepartmentAggregateType<T>>

    /**
     * Group by Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Department model
   */
  readonly fields: DepartmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Department.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Department$usersArgs<ExtArgs> = {}>(args?: Subset<T, Department$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    requestKanban<T extends Department$requestKanbanArgs<ExtArgs> = {}>(args?: Subset<T, Department$requestKanbanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    persetujuan<T extends Department$persetujuanArgs<ExtArgs> = {}>(args?: Subset<T, Department$persetujuanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Department model
   */
  interface DepartmentFieldRefs {
    readonly id_department: FieldRef<"Department", 'Int'>
    readonly name: FieldRef<"Department", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Department findUnique
   */
  export type DepartmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findUniqueOrThrow
   */
  export type DepartmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findFirst
   */
  export type DepartmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findFirstOrThrow
   */
  export type DepartmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findMany
   */
  export type DepartmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Departments to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department create
   */
  export type DepartmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Department.
     */
    data: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
  }

  /**
   * Department createMany
   */
  export type DepartmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Department update
   */
  export type DepartmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Department.
     */
    data: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
    /**
     * Choose, which Department to update.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department updateMany
   */
  export type DepartmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department upsert
   */
  export type DepartmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Department to update in case it exists.
     */
    where: DepartmentWhereUniqueInput
    /**
     * In case the Department found by the `where` argument doesn't exist, create a new Department with this data.
     */
    create: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
    /**
     * In case the Department was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
  }

  /**
   * Department delete
   */
  export type DepartmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter which Department to delete.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department deleteMany
   */
  export type DepartmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Departments to delete
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to delete.
     */
    limit?: number
  }

  /**
   * Department.users
   */
  export type Department$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Department.requestKanban
   */
  export type Department$requestKanbanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    where?: RequestKanbanWhereInput
    orderBy?: RequestKanbanOrderByWithRelationInput | RequestKanbanOrderByWithRelationInput[]
    cursor?: RequestKanbanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RequestKanbanScalarFieldEnum | RequestKanbanScalarFieldEnum[]
  }

  /**
   * Department.persetujuan
   */
  export type Department$persetujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    where?: PersetujuanWhereInput
    orderBy?: PersetujuanOrderByWithRelationInput | PersetujuanOrderByWithRelationInput[]
    cursor?: PersetujuanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PersetujuanScalarFieldEnum | PersetujuanScalarFieldEnum[]
  }

  /**
   * Department without action
   */
  export type DepartmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
  }


  /**
   * Model RequestKanban
   */

  export type AggregateRequestKanban = {
    _count: RequestKanbanCountAggregateOutputType | null
    _avg: RequestKanbanAvgAggregateOutputType | null
    _sum: RequestKanbanSumAggregateOutputType | null
    _min: RequestKanbanMinAggregateOutputType | null
    _max: RequestKanbanMaxAggregateOutputType | null
  }

  export type RequestKanbanAvgAggregateOutputType = {
    id_kanban: number | null
    id_users: number | null
    id_department: number | null
  }

  export type RequestKanbanSumAggregateOutputType = {
    id_kanban: number | null
    id_users: number | null
    id_department: number | null
  }

  export type RequestKanbanMinAggregateOutputType = {
    id_kanban: number | null
    id_users: number | null
    id_department: number | null
    tgl_produksi: Date | null
    parts_number: string | null
    lokasi: string | null
    box: string | null
    klasifikasi: string | null
    keterangan: string | null
    status: $Enums.RequestStatus | null
  }

  export type RequestKanbanMaxAggregateOutputType = {
    id_kanban: number | null
    id_users: number | null
    id_department: number | null
    tgl_produksi: Date | null
    parts_number: string | null
    lokasi: string | null
    box: string | null
    klasifikasi: string | null
    keterangan: string | null
    status: $Enums.RequestStatus | null
  }

  export type RequestKanbanCountAggregateOutputType = {
    id_kanban: number
    id_users: number
    id_department: number
    tgl_produksi: number
    parts_number: number
    lokasi: number
    box: number
    klasifikasi: number
    keterangan: number
    status: number
    _all: number
  }


  export type RequestKanbanAvgAggregateInputType = {
    id_kanban?: true
    id_users?: true
    id_department?: true
  }

  export type RequestKanbanSumAggregateInputType = {
    id_kanban?: true
    id_users?: true
    id_department?: true
  }

  export type RequestKanbanMinAggregateInputType = {
    id_kanban?: true
    id_users?: true
    id_department?: true
    tgl_produksi?: true
    parts_number?: true
    lokasi?: true
    box?: true
    klasifikasi?: true
    keterangan?: true
    status?: true
  }

  export type RequestKanbanMaxAggregateInputType = {
    id_kanban?: true
    id_users?: true
    id_department?: true
    tgl_produksi?: true
    parts_number?: true
    lokasi?: true
    box?: true
    klasifikasi?: true
    keterangan?: true
    status?: true
  }

  export type RequestKanbanCountAggregateInputType = {
    id_kanban?: true
    id_users?: true
    id_department?: true
    tgl_produksi?: true
    parts_number?: true
    lokasi?: true
    box?: true
    klasifikasi?: true
    keterangan?: true
    status?: true
    _all?: true
  }

  export type RequestKanbanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RequestKanban to aggregate.
     */
    where?: RequestKanbanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestKanbans to fetch.
     */
    orderBy?: RequestKanbanOrderByWithRelationInput | RequestKanbanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RequestKanbanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestKanbans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestKanbans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RequestKanbans
    **/
    _count?: true | RequestKanbanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RequestKanbanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RequestKanbanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RequestKanbanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RequestKanbanMaxAggregateInputType
  }

  export type GetRequestKanbanAggregateType<T extends RequestKanbanAggregateArgs> = {
        [P in keyof T & keyof AggregateRequestKanban]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRequestKanban[P]>
      : GetScalarType<T[P], AggregateRequestKanban[P]>
  }




  export type RequestKanbanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RequestKanbanWhereInput
    orderBy?: RequestKanbanOrderByWithAggregationInput | RequestKanbanOrderByWithAggregationInput[]
    by: RequestKanbanScalarFieldEnum[] | RequestKanbanScalarFieldEnum
    having?: RequestKanbanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RequestKanbanCountAggregateInputType | true
    _avg?: RequestKanbanAvgAggregateInputType
    _sum?: RequestKanbanSumAggregateInputType
    _min?: RequestKanbanMinAggregateInputType
    _max?: RequestKanbanMaxAggregateInputType
  }

  export type RequestKanbanGroupByOutputType = {
    id_kanban: number
    id_users: number
    id_department: number
    tgl_produksi: Date
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status: $Enums.RequestStatus
    _count: RequestKanbanCountAggregateOutputType | null
    _avg: RequestKanbanAvgAggregateOutputType | null
    _sum: RequestKanbanSumAggregateOutputType | null
    _min: RequestKanbanMinAggregateOutputType | null
    _max: RequestKanbanMaxAggregateOutputType | null
  }

  type GetRequestKanbanGroupByPayload<T extends RequestKanbanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RequestKanbanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RequestKanbanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RequestKanbanGroupByOutputType[P]>
            : GetScalarType<T[P], RequestKanbanGroupByOutputType[P]>
        }
      >
    >


  export type RequestKanbanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_kanban?: boolean
    id_users?: boolean
    id_department?: boolean
    tgl_produksi?: boolean
    parts_number?: boolean
    lokasi?: boolean
    box?: boolean
    klasifikasi?: boolean
    keterangan?: boolean
    status?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    persetujuan?: boolean | RequestKanban$persetujuanArgs<ExtArgs>
    notifications?: boolean | RequestKanban$notificationsArgs<ExtArgs>
    _count?: boolean | RequestKanbanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["requestKanban"]>



  export type RequestKanbanSelectScalar = {
    id_kanban?: boolean
    id_users?: boolean
    id_department?: boolean
    tgl_produksi?: boolean
    parts_number?: boolean
    lokasi?: boolean
    box?: boolean
    klasifikasi?: boolean
    keterangan?: boolean
    status?: boolean
  }

  export type RequestKanbanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_kanban" | "id_users" | "id_department" | "tgl_produksi" | "parts_number" | "lokasi" | "box" | "klasifikasi" | "keterangan" | "status", ExtArgs["result"]["requestKanban"]>
  export type RequestKanbanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    persetujuan?: boolean | RequestKanban$persetujuanArgs<ExtArgs>
    notifications?: boolean | RequestKanban$notificationsArgs<ExtArgs>
    _count?: boolean | RequestKanbanCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $RequestKanbanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RequestKanban"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      department: Prisma.$DepartmentPayload<ExtArgs>
      persetujuan: Prisma.$PersetujuanPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id_kanban: number
      id_users: number
      id_department: number
      tgl_produksi: Date
      parts_number: string
      lokasi: string
      box: string
      klasifikasi: string
      keterangan: string
      status: $Enums.RequestStatus
    }, ExtArgs["result"]["requestKanban"]>
    composites: {}
  }

  type RequestKanbanGetPayload<S extends boolean | null | undefined | RequestKanbanDefaultArgs> = $Result.GetResult<Prisma.$RequestKanbanPayload, S>

  type RequestKanbanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RequestKanbanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RequestKanbanCountAggregateInputType | true
    }

  export interface RequestKanbanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RequestKanban'], meta: { name: 'RequestKanban' } }
    /**
     * Find zero or one RequestKanban that matches the filter.
     * @param {RequestKanbanFindUniqueArgs} args - Arguments to find a RequestKanban
     * @example
     * // Get one RequestKanban
     * const requestKanban = await prisma.requestKanban.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RequestKanbanFindUniqueArgs>(args: SelectSubset<T, RequestKanbanFindUniqueArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RequestKanban that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RequestKanbanFindUniqueOrThrowArgs} args - Arguments to find a RequestKanban
     * @example
     * // Get one RequestKanban
     * const requestKanban = await prisma.requestKanban.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RequestKanbanFindUniqueOrThrowArgs>(args: SelectSubset<T, RequestKanbanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RequestKanban that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestKanbanFindFirstArgs} args - Arguments to find a RequestKanban
     * @example
     * // Get one RequestKanban
     * const requestKanban = await prisma.requestKanban.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RequestKanbanFindFirstArgs>(args?: SelectSubset<T, RequestKanbanFindFirstArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RequestKanban that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestKanbanFindFirstOrThrowArgs} args - Arguments to find a RequestKanban
     * @example
     * // Get one RequestKanban
     * const requestKanban = await prisma.requestKanban.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RequestKanbanFindFirstOrThrowArgs>(args?: SelectSubset<T, RequestKanbanFindFirstOrThrowArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RequestKanbans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestKanbanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RequestKanbans
     * const requestKanbans = await prisma.requestKanban.findMany()
     * 
     * // Get first 10 RequestKanbans
     * const requestKanbans = await prisma.requestKanban.findMany({ take: 10 })
     * 
     * // Only select the `id_kanban`
     * const requestKanbanWithId_kanbanOnly = await prisma.requestKanban.findMany({ select: { id_kanban: true } })
     * 
     */
    findMany<T extends RequestKanbanFindManyArgs>(args?: SelectSubset<T, RequestKanbanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RequestKanban.
     * @param {RequestKanbanCreateArgs} args - Arguments to create a RequestKanban.
     * @example
     * // Create one RequestKanban
     * const RequestKanban = await prisma.requestKanban.create({
     *   data: {
     *     // ... data to create a RequestKanban
     *   }
     * })
     * 
     */
    create<T extends RequestKanbanCreateArgs>(args: SelectSubset<T, RequestKanbanCreateArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RequestKanbans.
     * @param {RequestKanbanCreateManyArgs} args - Arguments to create many RequestKanbans.
     * @example
     * // Create many RequestKanbans
     * const requestKanban = await prisma.requestKanban.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RequestKanbanCreateManyArgs>(args?: SelectSubset<T, RequestKanbanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a RequestKanban.
     * @param {RequestKanbanDeleteArgs} args - Arguments to delete one RequestKanban.
     * @example
     * // Delete one RequestKanban
     * const RequestKanban = await prisma.requestKanban.delete({
     *   where: {
     *     // ... filter to delete one RequestKanban
     *   }
     * })
     * 
     */
    delete<T extends RequestKanbanDeleteArgs>(args: SelectSubset<T, RequestKanbanDeleteArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RequestKanban.
     * @param {RequestKanbanUpdateArgs} args - Arguments to update one RequestKanban.
     * @example
     * // Update one RequestKanban
     * const requestKanban = await prisma.requestKanban.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RequestKanbanUpdateArgs>(args: SelectSubset<T, RequestKanbanUpdateArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RequestKanbans.
     * @param {RequestKanbanDeleteManyArgs} args - Arguments to filter RequestKanbans to delete.
     * @example
     * // Delete a few RequestKanbans
     * const { count } = await prisma.requestKanban.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RequestKanbanDeleteManyArgs>(args?: SelectSubset<T, RequestKanbanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RequestKanbans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestKanbanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RequestKanbans
     * const requestKanban = await prisma.requestKanban.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RequestKanbanUpdateManyArgs>(args: SelectSubset<T, RequestKanbanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RequestKanban.
     * @param {RequestKanbanUpsertArgs} args - Arguments to update or create a RequestKanban.
     * @example
     * // Update or create a RequestKanban
     * const requestKanban = await prisma.requestKanban.upsert({
     *   create: {
     *     // ... data to create a RequestKanban
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RequestKanban we want to update
     *   }
     * })
     */
    upsert<T extends RequestKanbanUpsertArgs>(args: SelectSubset<T, RequestKanbanUpsertArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RequestKanbans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestKanbanCountArgs} args - Arguments to filter RequestKanbans to count.
     * @example
     * // Count the number of RequestKanbans
     * const count = await prisma.requestKanban.count({
     *   where: {
     *     // ... the filter for the RequestKanbans we want to count
     *   }
     * })
    **/
    count<T extends RequestKanbanCountArgs>(
      args?: Subset<T, RequestKanbanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RequestKanbanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RequestKanban.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestKanbanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RequestKanbanAggregateArgs>(args: Subset<T, RequestKanbanAggregateArgs>): Prisma.PrismaPromise<GetRequestKanbanAggregateType<T>>

    /**
     * Group by RequestKanban.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RequestKanbanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RequestKanbanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RequestKanbanGroupByArgs['orderBy'] }
        : { orderBy?: RequestKanbanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RequestKanbanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRequestKanbanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RequestKanban model
   */
  readonly fields: RequestKanbanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RequestKanban.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RequestKanbanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    department<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    persetujuan<T extends RequestKanban$persetujuanArgs<ExtArgs> = {}>(args?: Subset<T, RequestKanban$persetujuanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends RequestKanban$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, RequestKanban$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RequestKanban model
   */
  interface RequestKanbanFieldRefs {
    readonly id_kanban: FieldRef<"RequestKanban", 'Int'>
    readonly id_users: FieldRef<"RequestKanban", 'Int'>
    readonly id_department: FieldRef<"RequestKanban", 'Int'>
    readonly tgl_produksi: FieldRef<"RequestKanban", 'DateTime'>
    readonly parts_number: FieldRef<"RequestKanban", 'String'>
    readonly lokasi: FieldRef<"RequestKanban", 'String'>
    readonly box: FieldRef<"RequestKanban", 'String'>
    readonly klasifikasi: FieldRef<"RequestKanban", 'String'>
    readonly keterangan: FieldRef<"RequestKanban", 'String'>
    readonly status: FieldRef<"RequestKanban", 'RequestStatus'>
  }
    

  // Custom InputTypes
  /**
   * RequestKanban findUnique
   */
  export type RequestKanbanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    /**
     * Filter, which RequestKanban to fetch.
     */
    where: RequestKanbanWhereUniqueInput
  }

  /**
   * RequestKanban findUniqueOrThrow
   */
  export type RequestKanbanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    /**
     * Filter, which RequestKanban to fetch.
     */
    where: RequestKanbanWhereUniqueInput
  }

  /**
   * RequestKanban findFirst
   */
  export type RequestKanbanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    /**
     * Filter, which RequestKanban to fetch.
     */
    where?: RequestKanbanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestKanbans to fetch.
     */
    orderBy?: RequestKanbanOrderByWithRelationInput | RequestKanbanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RequestKanbans.
     */
    cursor?: RequestKanbanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestKanbans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestKanbans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestKanbans.
     */
    distinct?: RequestKanbanScalarFieldEnum | RequestKanbanScalarFieldEnum[]
  }

  /**
   * RequestKanban findFirstOrThrow
   */
  export type RequestKanbanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    /**
     * Filter, which RequestKanban to fetch.
     */
    where?: RequestKanbanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestKanbans to fetch.
     */
    orderBy?: RequestKanbanOrderByWithRelationInput | RequestKanbanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RequestKanbans.
     */
    cursor?: RequestKanbanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestKanbans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestKanbans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RequestKanbans.
     */
    distinct?: RequestKanbanScalarFieldEnum | RequestKanbanScalarFieldEnum[]
  }

  /**
   * RequestKanban findMany
   */
  export type RequestKanbanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    /**
     * Filter, which RequestKanbans to fetch.
     */
    where?: RequestKanbanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RequestKanbans to fetch.
     */
    orderBy?: RequestKanbanOrderByWithRelationInput | RequestKanbanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RequestKanbans.
     */
    cursor?: RequestKanbanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RequestKanbans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RequestKanbans.
     */
    skip?: number
    distinct?: RequestKanbanScalarFieldEnum | RequestKanbanScalarFieldEnum[]
  }

  /**
   * RequestKanban create
   */
  export type RequestKanbanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    /**
     * The data needed to create a RequestKanban.
     */
    data: XOR<RequestKanbanCreateInput, RequestKanbanUncheckedCreateInput>
  }

  /**
   * RequestKanban createMany
   */
  export type RequestKanbanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RequestKanbans.
     */
    data: RequestKanbanCreateManyInput | RequestKanbanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RequestKanban update
   */
  export type RequestKanbanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    /**
     * The data needed to update a RequestKanban.
     */
    data: XOR<RequestKanbanUpdateInput, RequestKanbanUncheckedUpdateInput>
    /**
     * Choose, which RequestKanban to update.
     */
    where: RequestKanbanWhereUniqueInput
  }

  /**
   * RequestKanban updateMany
   */
  export type RequestKanbanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RequestKanbans.
     */
    data: XOR<RequestKanbanUpdateManyMutationInput, RequestKanbanUncheckedUpdateManyInput>
    /**
     * Filter which RequestKanbans to update
     */
    where?: RequestKanbanWhereInput
    /**
     * Limit how many RequestKanbans to update.
     */
    limit?: number
  }

  /**
   * RequestKanban upsert
   */
  export type RequestKanbanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    /**
     * The filter to search for the RequestKanban to update in case it exists.
     */
    where: RequestKanbanWhereUniqueInput
    /**
     * In case the RequestKanban found by the `where` argument doesn't exist, create a new RequestKanban with this data.
     */
    create: XOR<RequestKanbanCreateInput, RequestKanbanUncheckedCreateInput>
    /**
     * In case the RequestKanban was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RequestKanbanUpdateInput, RequestKanbanUncheckedUpdateInput>
  }

  /**
   * RequestKanban delete
   */
  export type RequestKanbanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
    /**
     * Filter which RequestKanban to delete.
     */
    where: RequestKanbanWhereUniqueInput
  }

  /**
   * RequestKanban deleteMany
   */
  export type RequestKanbanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RequestKanbans to delete
     */
    where?: RequestKanbanWhereInput
    /**
     * Limit how many RequestKanbans to delete.
     */
    limit?: number
  }

  /**
   * RequestKanban.persetujuan
   */
  export type RequestKanban$persetujuanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    where?: PersetujuanWhereInput
    orderBy?: PersetujuanOrderByWithRelationInput | PersetujuanOrderByWithRelationInput[]
    cursor?: PersetujuanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PersetujuanScalarFieldEnum | PersetujuanScalarFieldEnum[]
  }

  /**
   * RequestKanban.notifications
   */
  export type RequestKanban$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * RequestKanban without action
   */
  export type RequestKanbanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RequestKanban
     */
    select?: RequestKanbanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RequestKanban
     */
    omit?: RequestKanbanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RequestKanbanInclude<ExtArgs> | null
  }


  /**
   * Model Persetujuan
   */

  export type AggregatePersetujuan = {
    _count: PersetujuanCountAggregateOutputType | null
    _avg: PersetujuanAvgAggregateOutputType | null
    _sum: PersetujuanSumAggregateOutputType | null
    _min: PersetujuanMinAggregateOutputType | null
    _max: PersetujuanMaxAggregateOutputType | null
  }

  export type PersetujuanAvgAggregateOutputType = {
    id_users: number | null
    id_department: number | null
    id_kanban: number | null
  }

  export type PersetujuanSumAggregateOutputType = {
    id_users: number | null
    id_department: number | null
    id_kanban: number | null
  }

  export type PersetujuanMinAggregateOutputType = {
    id_users: number | null
    id_department: number | null
    id_kanban: number | null
    role: $Enums.ApprovalRole | null
    approve: boolean | null
    approvedAt: Date | null
  }

  export type PersetujuanMaxAggregateOutputType = {
    id_users: number | null
    id_department: number | null
    id_kanban: number | null
    role: $Enums.ApprovalRole | null
    approve: boolean | null
    approvedAt: Date | null
  }

  export type PersetujuanCountAggregateOutputType = {
    id_users: number
    id_department: number
    id_kanban: number
    role: number
    approve: number
    approvedAt: number
    _all: number
  }


  export type PersetujuanAvgAggregateInputType = {
    id_users?: true
    id_department?: true
    id_kanban?: true
  }

  export type PersetujuanSumAggregateInputType = {
    id_users?: true
    id_department?: true
    id_kanban?: true
  }

  export type PersetujuanMinAggregateInputType = {
    id_users?: true
    id_department?: true
    id_kanban?: true
    role?: true
    approve?: true
    approvedAt?: true
  }

  export type PersetujuanMaxAggregateInputType = {
    id_users?: true
    id_department?: true
    id_kanban?: true
    role?: true
    approve?: true
    approvedAt?: true
  }

  export type PersetujuanCountAggregateInputType = {
    id_users?: true
    id_department?: true
    id_kanban?: true
    role?: true
    approve?: true
    approvedAt?: true
    _all?: true
  }

  export type PersetujuanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Persetujuan to aggregate.
     */
    where?: PersetujuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Persetujuans to fetch.
     */
    orderBy?: PersetujuanOrderByWithRelationInput | PersetujuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PersetujuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Persetujuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Persetujuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Persetujuans
    **/
    _count?: true | PersetujuanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PersetujuanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PersetujuanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PersetujuanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PersetujuanMaxAggregateInputType
  }

  export type GetPersetujuanAggregateType<T extends PersetujuanAggregateArgs> = {
        [P in keyof T & keyof AggregatePersetujuan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePersetujuan[P]>
      : GetScalarType<T[P], AggregatePersetujuan[P]>
  }




  export type PersetujuanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PersetujuanWhereInput
    orderBy?: PersetujuanOrderByWithAggregationInput | PersetujuanOrderByWithAggregationInput[]
    by: PersetujuanScalarFieldEnum[] | PersetujuanScalarFieldEnum
    having?: PersetujuanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PersetujuanCountAggregateInputType | true
    _avg?: PersetujuanAvgAggregateInputType
    _sum?: PersetujuanSumAggregateInputType
    _min?: PersetujuanMinAggregateInputType
    _max?: PersetujuanMaxAggregateInputType
  }

  export type PersetujuanGroupByOutputType = {
    id_users: number
    id_department: number
    id_kanban: number
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt: Date | null
    _count: PersetujuanCountAggregateOutputType | null
    _avg: PersetujuanAvgAggregateOutputType | null
    _sum: PersetujuanSumAggregateOutputType | null
    _min: PersetujuanMinAggregateOutputType | null
    _max: PersetujuanMaxAggregateOutputType | null
  }

  type GetPersetujuanGroupByPayload<T extends PersetujuanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PersetujuanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PersetujuanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PersetujuanGroupByOutputType[P]>
            : GetScalarType<T[P], PersetujuanGroupByOutputType[P]>
        }
      >
    >


  export type PersetujuanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id_users?: boolean
    id_department?: boolean
    id_kanban?: boolean
    role?: boolean
    approve?: boolean
    approvedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    requestKanban?: boolean | RequestKanbanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["persetujuan"]>



  export type PersetujuanSelectScalar = {
    id_users?: boolean
    id_department?: boolean
    id_kanban?: boolean
    role?: boolean
    approve?: boolean
    approvedAt?: boolean
  }

  export type PersetujuanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id_users" | "id_department" | "id_kanban" | "role" | "approve" | "approvedAt", ExtArgs["result"]["persetujuan"]>
  export type PersetujuanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
    requestKanban?: boolean | RequestKanbanDefaultArgs<ExtArgs>
  }

  export type $PersetujuanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Persetujuan"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      department: Prisma.$DepartmentPayload<ExtArgs>
      requestKanban: Prisma.$RequestKanbanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id_users: number
      id_department: number
      id_kanban: number
      role: $Enums.ApprovalRole
      approve: boolean
      approvedAt: Date | null
    }, ExtArgs["result"]["persetujuan"]>
    composites: {}
  }

  type PersetujuanGetPayload<S extends boolean | null | undefined | PersetujuanDefaultArgs> = $Result.GetResult<Prisma.$PersetujuanPayload, S>

  type PersetujuanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PersetujuanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PersetujuanCountAggregateInputType | true
    }

  export interface PersetujuanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Persetujuan'], meta: { name: 'Persetujuan' } }
    /**
     * Find zero or one Persetujuan that matches the filter.
     * @param {PersetujuanFindUniqueArgs} args - Arguments to find a Persetujuan
     * @example
     * // Get one Persetujuan
     * const persetujuan = await prisma.persetujuan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PersetujuanFindUniqueArgs>(args: SelectSubset<T, PersetujuanFindUniqueArgs<ExtArgs>>): Prisma__PersetujuanClient<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Persetujuan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PersetujuanFindUniqueOrThrowArgs} args - Arguments to find a Persetujuan
     * @example
     * // Get one Persetujuan
     * const persetujuan = await prisma.persetujuan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PersetujuanFindUniqueOrThrowArgs>(args: SelectSubset<T, PersetujuanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PersetujuanClient<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Persetujuan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersetujuanFindFirstArgs} args - Arguments to find a Persetujuan
     * @example
     * // Get one Persetujuan
     * const persetujuan = await prisma.persetujuan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PersetujuanFindFirstArgs>(args?: SelectSubset<T, PersetujuanFindFirstArgs<ExtArgs>>): Prisma__PersetujuanClient<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Persetujuan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersetujuanFindFirstOrThrowArgs} args - Arguments to find a Persetujuan
     * @example
     * // Get one Persetujuan
     * const persetujuan = await prisma.persetujuan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PersetujuanFindFirstOrThrowArgs>(args?: SelectSubset<T, PersetujuanFindFirstOrThrowArgs<ExtArgs>>): Prisma__PersetujuanClient<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Persetujuans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersetujuanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Persetujuans
     * const persetujuans = await prisma.persetujuan.findMany()
     * 
     * // Get first 10 Persetujuans
     * const persetujuans = await prisma.persetujuan.findMany({ take: 10 })
     * 
     * // Only select the `id_users`
     * const persetujuanWithId_usersOnly = await prisma.persetujuan.findMany({ select: { id_users: true } })
     * 
     */
    findMany<T extends PersetujuanFindManyArgs>(args?: SelectSubset<T, PersetujuanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Persetujuan.
     * @param {PersetujuanCreateArgs} args - Arguments to create a Persetujuan.
     * @example
     * // Create one Persetujuan
     * const Persetujuan = await prisma.persetujuan.create({
     *   data: {
     *     // ... data to create a Persetujuan
     *   }
     * })
     * 
     */
    create<T extends PersetujuanCreateArgs>(args: SelectSubset<T, PersetujuanCreateArgs<ExtArgs>>): Prisma__PersetujuanClient<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Persetujuans.
     * @param {PersetujuanCreateManyArgs} args - Arguments to create many Persetujuans.
     * @example
     * // Create many Persetujuans
     * const persetujuan = await prisma.persetujuan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PersetujuanCreateManyArgs>(args?: SelectSubset<T, PersetujuanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Persetujuan.
     * @param {PersetujuanDeleteArgs} args - Arguments to delete one Persetujuan.
     * @example
     * // Delete one Persetujuan
     * const Persetujuan = await prisma.persetujuan.delete({
     *   where: {
     *     // ... filter to delete one Persetujuan
     *   }
     * })
     * 
     */
    delete<T extends PersetujuanDeleteArgs>(args: SelectSubset<T, PersetujuanDeleteArgs<ExtArgs>>): Prisma__PersetujuanClient<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Persetujuan.
     * @param {PersetujuanUpdateArgs} args - Arguments to update one Persetujuan.
     * @example
     * // Update one Persetujuan
     * const persetujuan = await prisma.persetujuan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PersetujuanUpdateArgs>(args: SelectSubset<T, PersetujuanUpdateArgs<ExtArgs>>): Prisma__PersetujuanClient<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Persetujuans.
     * @param {PersetujuanDeleteManyArgs} args - Arguments to filter Persetujuans to delete.
     * @example
     * // Delete a few Persetujuans
     * const { count } = await prisma.persetujuan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PersetujuanDeleteManyArgs>(args?: SelectSubset<T, PersetujuanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Persetujuans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersetujuanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Persetujuans
     * const persetujuan = await prisma.persetujuan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PersetujuanUpdateManyArgs>(args: SelectSubset<T, PersetujuanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Persetujuan.
     * @param {PersetujuanUpsertArgs} args - Arguments to update or create a Persetujuan.
     * @example
     * // Update or create a Persetujuan
     * const persetujuan = await prisma.persetujuan.upsert({
     *   create: {
     *     // ... data to create a Persetujuan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Persetujuan we want to update
     *   }
     * })
     */
    upsert<T extends PersetujuanUpsertArgs>(args: SelectSubset<T, PersetujuanUpsertArgs<ExtArgs>>): Prisma__PersetujuanClient<$Result.GetResult<Prisma.$PersetujuanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Persetujuans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersetujuanCountArgs} args - Arguments to filter Persetujuans to count.
     * @example
     * // Count the number of Persetujuans
     * const count = await prisma.persetujuan.count({
     *   where: {
     *     // ... the filter for the Persetujuans we want to count
     *   }
     * })
    **/
    count<T extends PersetujuanCountArgs>(
      args?: Subset<T, PersetujuanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PersetujuanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Persetujuan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersetujuanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PersetujuanAggregateArgs>(args: Subset<T, PersetujuanAggregateArgs>): Prisma.PrismaPromise<GetPersetujuanAggregateType<T>>

    /**
     * Group by Persetujuan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PersetujuanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PersetujuanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PersetujuanGroupByArgs['orderBy'] }
        : { orderBy?: PersetujuanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PersetujuanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPersetujuanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Persetujuan model
   */
  readonly fields: PersetujuanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Persetujuan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PersetujuanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    department<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    requestKanban<T extends RequestKanbanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RequestKanbanDefaultArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Persetujuan model
   */
  interface PersetujuanFieldRefs {
    readonly id_users: FieldRef<"Persetujuan", 'Int'>
    readonly id_department: FieldRef<"Persetujuan", 'Int'>
    readonly id_kanban: FieldRef<"Persetujuan", 'Int'>
    readonly role: FieldRef<"Persetujuan", 'ApprovalRole'>
    readonly approve: FieldRef<"Persetujuan", 'Boolean'>
    readonly approvedAt: FieldRef<"Persetujuan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Persetujuan findUnique
   */
  export type PersetujuanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    /**
     * Filter, which Persetujuan to fetch.
     */
    where: PersetujuanWhereUniqueInput
  }

  /**
   * Persetujuan findUniqueOrThrow
   */
  export type PersetujuanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    /**
     * Filter, which Persetujuan to fetch.
     */
    where: PersetujuanWhereUniqueInput
  }

  /**
   * Persetujuan findFirst
   */
  export type PersetujuanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    /**
     * Filter, which Persetujuan to fetch.
     */
    where?: PersetujuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Persetujuans to fetch.
     */
    orderBy?: PersetujuanOrderByWithRelationInput | PersetujuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Persetujuans.
     */
    cursor?: PersetujuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Persetujuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Persetujuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Persetujuans.
     */
    distinct?: PersetujuanScalarFieldEnum | PersetujuanScalarFieldEnum[]
  }

  /**
   * Persetujuan findFirstOrThrow
   */
  export type PersetujuanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    /**
     * Filter, which Persetujuan to fetch.
     */
    where?: PersetujuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Persetujuans to fetch.
     */
    orderBy?: PersetujuanOrderByWithRelationInput | PersetujuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Persetujuans.
     */
    cursor?: PersetujuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Persetujuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Persetujuans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Persetujuans.
     */
    distinct?: PersetujuanScalarFieldEnum | PersetujuanScalarFieldEnum[]
  }

  /**
   * Persetujuan findMany
   */
  export type PersetujuanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    /**
     * Filter, which Persetujuans to fetch.
     */
    where?: PersetujuanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Persetujuans to fetch.
     */
    orderBy?: PersetujuanOrderByWithRelationInput | PersetujuanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Persetujuans.
     */
    cursor?: PersetujuanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Persetujuans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Persetujuans.
     */
    skip?: number
    distinct?: PersetujuanScalarFieldEnum | PersetujuanScalarFieldEnum[]
  }

  /**
   * Persetujuan create
   */
  export type PersetujuanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    /**
     * The data needed to create a Persetujuan.
     */
    data: XOR<PersetujuanCreateInput, PersetujuanUncheckedCreateInput>
  }

  /**
   * Persetujuan createMany
   */
  export type PersetujuanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Persetujuans.
     */
    data: PersetujuanCreateManyInput | PersetujuanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Persetujuan update
   */
  export type PersetujuanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    /**
     * The data needed to update a Persetujuan.
     */
    data: XOR<PersetujuanUpdateInput, PersetujuanUncheckedUpdateInput>
    /**
     * Choose, which Persetujuan to update.
     */
    where: PersetujuanWhereUniqueInput
  }

  /**
   * Persetujuan updateMany
   */
  export type PersetujuanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Persetujuans.
     */
    data: XOR<PersetujuanUpdateManyMutationInput, PersetujuanUncheckedUpdateManyInput>
    /**
     * Filter which Persetujuans to update
     */
    where?: PersetujuanWhereInput
    /**
     * Limit how many Persetujuans to update.
     */
    limit?: number
  }

  /**
   * Persetujuan upsert
   */
  export type PersetujuanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    /**
     * The filter to search for the Persetujuan to update in case it exists.
     */
    where: PersetujuanWhereUniqueInput
    /**
     * In case the Persetujuan found by the `where` argument doesn't exist, create a new Persetujuan with this data.
     */
    create: XOR<PersetujuanCreateInput, PersetujuanUncheckedCreateInput>
    /**
     * In case the Persetujuan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PersetujuanUpdateInput, PersetujuanUncheckedUpdateInput>
  }

  /**
   * Persetujuan delete
   */
  export type PersetujuanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
    /**
     * Filter which Persetujuan to delete.
     */
    where: PersetujuanWhereUniqueInput
  }

  /**
   * Persetujuan deleteMany
   */
  export type PersetujuanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Persetujuans to delete
     */
    where?: PersetujuanWhereInput
    /**
     * Limit how many Persetujuans to delete.
     */
    limit?: number
  }

  /**
   * Persetujuan without action
   */
  export type PersetujuanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Persetujuan
     */
    select?: PersetujuanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Persetujuan
     */
    omit?: PersetujuanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PersetujuanInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    kanbanId: number | null
  }

  export type NotificationSumAggregateOutputType = {
    id: number | null
    userId: number | null
    kanbanId: number | null
  }

  export type NotificationMinAggregateOutputType = {
    id: number | null
    userId: number | null
    kanbanId: number | null
    type: string | null
    message: string | null
    sentAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    kanbanId: number | null
    type: string | null
    message: string | null
    sentAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    kanbanId: number
    type: number
    message: number
    sentAt: number
    _all: number
  }


  export type NotificationAvgAggregateInputType = {
    id?: true
    userId?: true
    kanbanId?: true
  }

  export type NotificationSumAggregateInputType = {
    id?: true
    userId?: true
    kanbanId?: true
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    kanbanId?: true
    type?: true
    message?: true
    sentAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    kanbanId?: true
    type?: true
    message?: true
    sentAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    kanbanId?: true
    type?: true
    message?: true
    sentAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _avg?: NotificationAvgAggregateInputType
    _sum?: NotificationSumAggregateInputType
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: number
    userId: number
    kanbanId: number
    type: string
    message: string
    sentAt: Date
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    kanbanId?: boolean
    type?: boolean
    message?: boolean
    sentAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    kanban?: boolean | RequestKanbanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>



  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    kanbanId?: boolean
    type?: boolean
    message?: boolean
    sentAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "kanbanId" | "type" | "message" | "sentAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    kanban?: boolean | RequestKanbanDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      kanban: Prisma.$RequestKanbanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      kanbanId: number
      type: string
      message: string
      sentAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    kanban<T extends RequestKanbanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RequestKanbanDefaultArgs<ExtArgs>>): Prisma__RequestKanbanClient<$Result.GetResult<Prisma.$RequestKanbanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'Int'>
    readonly userId: FieldRef<"Notification", 'Int'>
    readonly kanbanId: FieldRef<"Notification", 'Int'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly sentAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id_users: 'id_users',
    id_department: 'id_department',
    name: 'name',
    role: 'role',
    email: 'email',
    no_hp: 'no_hp',
    password: 'password'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DepartmentScalarFieldEnum: {
    id_department: 'id_department',
    name: 'name'
  };

  export type DepartmentScalarFieldEnum = (typeof DepartmentScalarFieldEnum)[keyof typeof DepartmentScalarFieldEnum]


  export const RequestKanbanScalarFieldEnum: {
    id_kanban: 'id_kanban',
    id_users: 'id_users',
    id_department: 'id_department',
    tgl_produksi: 'tgl_produksi',
    parts_number: 'parts_number',
    lokasi: 'lokasi',
    box: 'box',
    klasifikasi: 'klasifikasi',
    keterangan: 'keterangan',
    status: 'status'
  };

  export type RequestKanbanScalarFieldEnum = (typeof RequestKanbanScalarFieldEnum)[keyof typeof RequestKanbanScalarFieldEnum]


  export const PersetujuanScalarFieldEnum: {
    id_users: 'id_users',
    id_department: 'id_department',
    id_kanban: 'id_kanban',
    role: 'role',
    approve: 'approve',
    approvedAt: 'approvedAt'
  };

  export type PersetujuanScalarFieldEnum = (typeof PersetujuanScalarFieldEnum)[keyof typeof PersetujuanScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    kanbanId: 'kanbanId',
    type: 'type',
    message: 'message',
    sentAt: 'sentAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const UserOrderByRelevanceFieldEnum: {
    name: 'name',
    email: 'email',
    no_hp: 'no_hp',
    password: 'password'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const DepartmentOrderByRelevanceFieldEnum: {
    name: 'name'
  };

  export type DepartmentOrderByRelevanceFieldEnum = (typeof DepartmentOrderByRelevanceFieldEnum)[keyof typeof DepartmentOrderByRelevanceFieldEnum]


  export const RequestKanbanOrderByRelevanceFieldEnum: {
    parts_number: 'parts_number',
    lokasi: 'lokasi',
    box: 'box',
    klasifikasi: 'klasifikasi',
    keterangan: 'keterangan'
  };

  export type RequestKanbanOrderByRelevanceFieldEnum = (typeof RequestKanbanOrderByRelevanceFieldEnum)[keyof typeof RequestKanbanOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const NotificationOrderByRelevanceFieldEnum: {
    type: 'type',
    message: 'message'
  };

  export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'RequestStatus'
   */
  export type EnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus'>
    


  /**
   * Reference to a field of type 'ApprovalRole'
   */
  export type EnumApprovalRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApprovalRole'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id_users?: IntFilter<"User"> | number
    id_department?: IntFilter<"User"> | number
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    email?: StringFilter<"User"> | string
    no_hp?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    requestKanban?: RequestKanbanListRelationFilter
    persetujuan?: PersetujuanListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    no_hp?: SortOrder
    password?: SortOrder
    department?: DepartmentOrderByWithRelationInput
    requestKanban?: RequestKanbanOrderByRelationAggregateInput
    persetujuan?: PersetujuanOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id_users?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id_department?: IntFilter<"User"> | number
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    no_hp?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    requestKanban?: RequestKanbanListRelationFilter
    persetujuan?: PersetujuanListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id_users" | "email">

  export type UserOrderByWithAggregationInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    no_hp?: SortOrder
    password?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id_users?: IntWithAggregatesFilter<"User"> | number
    id_department?: IntWithAggregatesFilter<"User"> | number
    name?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    email?: StringWithAggregatesFilter<"User"> | string
    no_hp?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
  }

  export type DepartmentWhereInput = {
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    id_department?: IntFilter<"Department"> | number
    name?: StringFilter<"Department"> | string
    users?: UserListRelationFilter
    requestKanban?: RequestKanbanListRelationFilter
    persetujuan?: PersetujuanListRelationFilter
  }

  export type DepartmentOrderByWithRelationInput = {
    id_department?: SortOrder
    name?: SortOrder
    users?: UserOrderByRelationAggregateInput
    requestKanban?: RequestKanbanOrderByRelationAggregateInput
    persetujuan?: PersetujuanOrderByRelationAggregateInput
    _relevance?: DepartmentOrderByRelevanceInput
  }

  export type DepartmentWhereUniqueInput = Prisma.AtLeast<{
    id_department?: number
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    name?: StringFilter<"Department"> | string
    users?: UserListRelationFilter
    requestKanban?: RequestKanbanListRelationFilter
    persetujuan?: PersetujuanListRelationFilter
  }, "id_department">

  export type DepartmentOrderByWithAggregationInput = {
    id_department?: SortOrder
    name?: SortOrder
    _count?: DepartmentCountOrderByAggregateInput
    _avg?: DepartmentAvgOrderByAggregateInput
    _max?: DepartmentMaxOrderByAggregateInput
    _min?: DepartmentMinOrderByAggregateInput
    _sum?: DepartmentSumOrderByAggregateInput
  }

  export type DepartmentScalarWhereWithAggregatesInput = {
    AND?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    OR?: DepartmentScalarWhereWithAggregatesInput[]
    NOT?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    id_department?: IntWithAggregatesFilter<"Department"> | number
    name?: StringWithAggregatesFilter<"Department"> | string
  }

  export type RequestKanbanWhereInput = {
    AND?: RequestKanbanWhereInput | RequestKanbanWhereInput[]
    OR?: RequestKanbanWhereInput[]
    NOT?: RequestKanbanWhereInput | RequestKanbanWhereInput[]
    id_kanban?: IntFilter<"RequestKanban"> | number
    id_users?: IntFilter<"RequestKanban"> | number
    id_department?: IntFilter<"RequestKanban"> | number
    tgl_produksi?: DateTimeFilter<"RequestKanban"> | Date | string
    parts_number?: StringFilter<"RequestKanban"> | string
    lokasi?: StringFilter<"RequestKanban"> | string
    box?: StringFilter<"RequestKanban"> | string
    klasifikasi?: StringFilter<"RequestKanban"> | string
    keterangan?: StringFilter<"RequestKanban"> | string
    status?: EnumRequestStatusFilter<"RequestKanban"> | $Enums.RequestStatus
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    persetujuan?: PersetujuanListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type RequestKanbanOrderByWithRelationInput = {
    id_kanban?: SortOrder
    id_users?: SortOrder
    id_department?: SortOrder
    tgl_produksi?: SortOrder
    parts_number?: SortOrder
    lokasi?: SortOrder
    box?: SortOrder
    klasifikasi?: SortOrder
    keterangan?: SortOrder
    status?: SortOrder
    user?: UserOrderByWithRelationInput
    department?: DepartmentOrderByWithRelationInput
    persetujuan?: PersetujuanOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    _relevance?: RequestKanbanOrderByRelevanceInput
  }

  export type RequestKanbanWhereUniqueInput = Prisma.AtLeast<{
    id_kanban?: number
    AND?: RequestKanbanWhereInput | RequestKanbanWhereInput[]
    OR?: RequestKanbanWhereInput[]
    NOT?: RequestKanbanWhereInput | RequestKanbanWhereInput[]
    id_users?: IntFilter<"RequestKanban"> | number
    id_department?: IntFilter<"RequestKanban"> | number
    tgl_produksi?: DateTimeFilter<"RequestKanban"> | Date | string
    parts_number?: StringFilter<"RequestKanban"> | string
    lokasi?: StringFilter<"RequestKanban"> | string
    box?: StringFilter<"RequestKanban"> | string
    klasifikasi?: StringFilter<"RequestKanban"> | string
    keterangan?: StringFilter<"RequestKanban"> | string
    status?: EnumRequestStatusFilter<"RequestKanban"> | $Enums.RequestStatus
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    persetujuan?: PersetujuanListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id_kanban">

  export type RequestKanbanOrderByWithAggregationInput = {
    id_kanban?: SortOrder
    id_users?: SortOrder
    id_department?: SortOrder
    tgl_produksi?: SortOrder
    parts_number?: SortOrder
    lokasi?: SortOrder
    box?: SortOrder
    klasifikasi?: SortOrder
    keterangan?: SortOrder
    status?: SortOrder
    _count?: RequestKanbanCountOrderByAggregateInput
    _avg?: RequestKanbanAvgOrderByAggregateInput
    _max?: RequestKanbanMaxOrderByAggregateInput
    _min?: RequestKanbanMinOrderByAggregateInput
    _sum?: RequestKanbanSumOrderByAggregateInput
  }

  export type RequestKanbanScalarWhereWithAggregatesInput = {
    AND?: RequestKanbanScalarWhereWithAggregatesInput | RequestKanbanScalarWhereWithAggregatesInput[]
    OR?: RequestKanbanScalarWhereWithAggregatesInput[]
    NOT?: RequestKanbanScalarWhereWithAggregatesInput | RequestKanbanScalarWhereWithAggregatesInput[]
    id_kanban?: IntWithAggregatesFilter<"RequestKanban"> | number
    id_users?: IntWithAggregatesFilter<"RequestKanban"> | number
    id_department?: IntWithAggregatesFilter<"RequestKanban"> | number
    tgl_produksi?: DateTimeWithAggregatesFilter<"RequestKanban"> | Date | string
    parts_number?: StringWithAggregatesFilter<"RequestKanban"> | string
    lokasi?: StringWithAggregatesFilter<"RequestKanban"> | string
    box?: StringWithAggregatesFilter<"RequestKanban"> | string
    klasifikasi?: StringWithAggregatesFilter<"RequestKanban"> | string
    keterangan?: StringWithAggregatesFilter<"RequestKanban"> | string
    status?: EnumRequestStatusWithAggregatesFilter<"RequestKanban"> | $Enums.RequestStatus
  }

  export type PersetujuanWhereInput = {
    AND?: PersetujuanWhereInput | PersetujuanWhereInput[]
    OR?: PersetujuanWhereInput[]
    NOT?: PersetujuanWhereInput | PersetujuanWhereInput[]
    id_users?: IntFilter<"Persetujuan"> | number
    id_department?: IntFilter<"Persetujuan"> | number
    id_kanban?: IntFilter<"Persetujuan"> | number
    role?: EnumApprovalRoleFilter<"Persetujuan"> | $Enums.ApprovalRole
    approve?: BoolFilter<"Persetujuan"> | boolean
    approvedAt?: DateTimeNullableFilter<"Persetujuan"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    requestKanban?: XOR<RequestKanbanScalarRelationFilter, RequestKanbanWhereInput>
  }

  export type PersetujuanOrderByWithRelationInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    id_kanban?: SortOrder
    role?: SortOrder
    approve?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    department?: DepartmentOrderByWithRelationInput
    requestKanban?: RequestKanbanOrderByWithRelationInput
  }

  export type PersetujuanWhereUniqueInput = Prisma.AtLeast<{
    id_users_id_department_id_kanban_role?: PersetujuanId_usersId_departmentId_kanbanRoleCompoundUniqueInput
    AND?: PersetujuanWhereInput | PersetujuanWhereInput[]
    OR?: PersetujuanWhereInput[]
    NOT?: PersetujuanWhereInput | PersetujuanWhereInput[]
    id_users?: IntFilter<"Persetujuan"> | number
    id_department?: IntFilter<"Persetujuan"> | number
    id_kanban?: IntFilter<"Persetujuan"> | number
    role?: EnumApprovalRoleFilter<"Persetujuan"> | $Enums.ApprovalRole
    approve?: BoolFilter<"Persetujuan"> | boolean
    approvedAt?: DateTimeNullableFilter<"Persetujuan"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    requestKanban?: XOR<RequestKanbanScalarRelationFilter, RequestKanbanWhereInput>
  }, "id_users_id_department_id_kanban_role">

  export type PersetujuanOrderByWithAggregationInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    id_kanban?: SortOrder
    role?: SortOrder
    approve?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    _count?: PersetujuanCountOrderByAggregateInput
    _avg?: PersetujuanAvgOrderByAggregateInput
    _max?: PersetujuanMaxOrderByAggregateInput
    _min?: PersetujuanMinOrderByAggregateInput
    _sum?: PersetujuanSumOrderByAggregateInput
  }

  export type PersetujuanScalarWhereWithAggregatesInput = {
    AND?: PersetujuanScalarWhereWithAggregatesInput | PersetujuanScalarWhereWithAggregatesInput[]
    OR?: PersetujuanScalarWhereWithAggregatesInput[]
    NOT?: PersetujuanScalarWhereWithAggregatesInput | PersetujuanScalarWhereWithAggregatesInput[]
    id_users?: IntWithAggregatesFilter<"Persetujuan"> | number
    id_department?: IntWithAggregatesFilter<"Persetujuan"> | number
    id_kanban?: IntWithAggregatesFilter<"Persetujuan"> | number
    role?: EnumApprovalRoleWithAggregatesFilter<"Persetujuan"> | $Enums.ApprovalRole
    approve?: BoolWithAggregatesFilter<"Persetujuan"> | boolean
    approvedAt?: DateTimeNullableWithAggregatesFilter<"Persetujuan"> | Date | string | null
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    kanbanId?: IntFilter<"Notification"> | number
    type?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    sentAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    kanban?: XOR<RequestKanbanScalarRelationFilter, RequestKanbanWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    kanbanId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    sentAt?: SortOrder
    user?: UserOrderByWithRelationInput
    kanban?: RequestKanbanOrderByWithRelationInput
    _relevance?: NotificationOrderByRelevanceInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: IntFilter<"Notification"> | number
    kanbanId?: IntFilter<"Notification"> | number
    type?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    sentAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    kanban?: XOR<RequestKanbanScalarRelationFilter, RequestKanbanWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    kanbanId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    sentAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _avg?: NotificationAvgOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
    _sum?: NotificationSumOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Notification"> | number
    userId?: IntWithAggregatesFilter<"Notification"> | number
    kanbanId?: IntWithAggregatesFilter<"Notification"> | number
    type?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    sentAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type UserCreateInput = {
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    department: DepartmentCreateNestedOneWithoutUsersInput
    requestKanban?: RequestKanbanCreateNestedManyWithoutUserInput
    persetujuan?: PersetujuanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id_users?: number
    id_department: number
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    requestKanban?: RequestKanbanUncheckedCreateNestedManyWithoutUserInput
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    department?: DepartmentUpdateOneRequiredWithoutUsersNestedInput
    requestKanban?: RequestKanbanUpdateManyWithoutUserNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    requestKanban?: RequestKanbanUncheckedUpdateManyWithoutUserNestedInput
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id_users?: number
    id_department: number
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
  }

  export type UserUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type DepartmentCreateInput = {
    name: string
    users?: UserCreateNestedManyWithoutDepartmentInput
    requestKanban?: RequestKanbanCreateNestedManyWithoutDepartmentInput
    persetujuan?: PersetujuanCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateInput = {
    id_department?: number
    name: string
    users?: UserUncheckedCreateNestedManyWithoutDepartmentInput
    requestKanban?: RequestKanbanUncheckedCreateNestedManyWithoutDepartmentInput
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUpdateManyWithoutDepartmentNestedInput
    requestKanban?: RequestKanbanUpdateManyWithoutDepartmentNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateInput = {
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUncheckedUpdateManyWithoutDepartmentNestedInput
    requestKanban?: RequestKanbanUncheckedUpdateManyWithoutDepartmentNestedInput
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentCreateManyInput = {
    id_department?: number
    name: string
  }

  export type DepartmentUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
  }

  export type DepartmentUncheckedUpdateManyInput = {
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
  }

  export type RequestKanbanCreateInput = {
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    user: UserCreateNestedOneWithoutRequestKanbanInput
    department: DepartmentCreateNestedOneWithoutRequestKanbanInput
    persetujuan?: PersetujuanCreateNestedManyWithoutRequestKanbanInput
    notifications?: NotificationCreateNestedManyWithoutKanbanInput
  }

  export type RequestKanbanUncheckedCreateInput = {
    id_kanban?: number
    id_users: number
    id_department: number
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutRequestKanbanInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutKanbanInput
  }

  export type RequestKanbanUpdateInput = {
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    user?: UserUpdateOneRequiredWithoutRequestKanbanNestedInput
    department?: DepartmentUpdateOneRequiredWithoutRequestKanbanNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutRequestKanbanNestedInput
    notifications?: NotificationUpdateManyWithoutKanbanNestedInput
  }

  export type RequestKanbanUncheckedUpdateInput = {
    id_kanban?: IntFieldUpdateOperationsInput | number
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutRequestKanbanNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutKanbanNestedInput
  }

  export type RequestKanbanCreateManyInput = {
    id_kanban?: number
    id_users: number
    id_department: number
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
  }

  export type RequestKanbanUpdateManyMutationInput = {
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type RequestKanbanUncheckedUpdateManyInput = {
    id_kanban?: IntFieldUpdateOperationsInput | number
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type PersetujuanCreateInput = {
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPersetujuanInput
    department: DepartmentCreateNestedOneWithoutPersetujuanInput
    requestKanban: RequestKanbanCreateNestedOneWithoutPersetujuanInput
  }

  export type PersetujuanUncheckedCreateInput = {
    id_users: number
    id_department: number
    id_kanban: number
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
  }

  export type PersetujuanUpdateInput = {
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPersetujuanNestedInput
    department?: DepartmentUpdateOneRequiredWithoutPersetujuanNestedInput
    requestKanban?: RequestKanbanUpdateOneRequiredWithoutPersetujuanNestedInput
  }

  export type PersetujuanUncheckedUpdateInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    id_kanban?: IntFieldUpdateOperationsInput | number
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersetujuanCreateManyInput = {
    id_users: number
    id_department: number
    id_kanban: number
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
  }

  export type PersetujuanUpdateManyMutationInput = {
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersetujuanUncheckedUpdateManyInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    id_kanban?: IntFieldUpdateOperationsInput | number
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationCreateInput = {
    type: string
    message: string
    sentAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    kanban: RequestKanbanCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: number
    userId: number
    kanbanId: number
    type: string
    message: string
    sentAt?: Date | string
  }

  export type NotificationUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    kanban?: RequestKanbanUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    kanbanId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: number
    userId: number
    kanbanId: number
    type: string
    message: string
    sentAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    kanbanId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DepartmentScalarRelationFilter = {
    is?: DepartmentWhereInput
    isNot?: DepartmentWhereInput
  }

  export type RequestKanbanListRelationFilter = {
    every?: RequestKanbanWhereInput
    some?: RequestKanbanWhereInput
    none?: RequestKanbanWhereInput
  }

  export type PersetujuanListRelationFilter = {
    every?: PersetujuanWhereInput
    some?: PersetujuanWhereInput
    none?: PersetujuanWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type RequestKanbanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PersetujuanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    no_hp?: SortOrder
    password?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    no_hp?: SortOrder
    password?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    no_hp?: SortOrder
    password?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentOrderByRelevanceInput = {
    fields: DepartmentOrderByRelevanceFieldEnum | DepartmentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type DepartmentCountOrderByAggregateInput = {
    id_department?: SortOrder
    name?: SortOrder
  }

  export type DepartmentAvgOrderByAggregateInput = {
    id_department?: SortOrder
  }

  export type DepartmentMaxOrderByAggregateInput = {
    id_department?: SortOrder
    name?: SortOrder
  }

  export type DepartmentMinOrderByAggregateInput = {
    id_department?: SortOrder
    name?: SortOrder
  }

  export type DepartmentSumOrderByAggregateInput = {
    id_department?: SortOrder
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[]
    notIn?: $Enums.RequestStatus[]
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RequestKanbanOrderByRelevanceInput = {
    fields: RequestKanbanOrderByRelevanceFieldEnum | RequestKanbanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RequestKanbanCountOrderByAggregateInput = {
    id_kanban?: SortOrder
    id_users?: SortOrder
    id_department?: SortOrder
    tgl_produksi?: SortOrder
    parts_number?: SortOrder
    lokasi?: SortOrder
    box?: SortOrder
    klasifikasi?: SortOrder
    keterangan?: SortOrder
    status?: SortOrder
  }

  export type RequestKanbanAvgOrderByAggregateInput = {
    id_kanban?: SortOrder
    id_users?: SortOrder
    id_department?: SortOrder
  }

  export type RequestKanbanMaxOrderByAggregateInput = {
    id_kanban?: SortOrder
    id_users?: SortOrder
    id_department?: SortOrder
    tgl_produksi?: SortOrder
    parts_number?: SortOrder
    lokasi?: SortOrder
    box?: SortOrder
    klasifikasi?: SortOrder
    keterangan?: SortOrder
    status?: SortOrder
  }

  export type RequestKanbanMinOrderByAggregateInput = {
    id_kanban?: SortOrder
    id_users?: SortOrder
    id_department?: SortOrder
    tgl_produksi?: SortOrder
    parts_number?: SortOrder
    lokasi?: SortOrder
    box?: SortOrder
    klasifikasi?: SortOrder
    keterangan?: SortOrder
    status?: SortOrder
  }

  export type RequestKanbanSumOrderByAggregateInput = {
    id_kanban?: SortOrder
    id_users?: SortOrder
    id_department?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[]
    notIn?: $Enums.RequestStatus[]
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
  }

  export type EnumApprovalRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ApprovalRole | EnumApprovalRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ApprovalRole[]
    notIn?: $Enums.ApprovalRole[]
    not?: NestedEnumApprovalRoleFilter<$PrismaModel> | $Enums.ApprovalRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type RequestKanbanScalarRelationFilter = {
    is?: RequestKanbanWhereInput
    isNot?: RequestKanbanWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PersetujuanId_usersId_departmentId_kanbanRoleCompoundUniqueInput = {
    id_users: number
    id_department: number
    id_kanban: number
    role: $Enums.ApprovalRole
  }

  export type PersetujuanCountOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    id_kanban?: SortOrder
    role?: SortOrder
    approve?: SortOrder
    approvedAt?: SortOrder
  }

  export type PersetujuanAvgOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    id_kanban?: SortOrder
  }

  export type PersetujuanMaxOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    id_kanban?: SortOrder
    role?: SortOrder
    approve?: SortOrder
    approvedAt?: SortOrder
  }

  export type PersetujuanMinOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    id_kanban?: SortOrder
    role?: SortOrder
    approve?: SortOrder
    approvedAt?: SortOrder
  }

  export type PersetujuanSumOrderByAggregateInput = {
    id_users?: SortOrder
    id_department?: SortOrder
    id_kanban?: SortOrder
  }

  export type EnumApprovalRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApprovalRole | EnumApprovalRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ApprovalRole[]
    notIn?: $Enums.ApprovalRole[]
    not?: NestedEnumApprovalRoleWithAggregatesFilter<$PrismaModel> | $Enums.ApprovalRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApprovalRoleFilter<$PrismaModel>
    _max?: NestedEnumApprovalRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NotificationOrderByRelevanceInput = {
    fields: NotificationOrderByRelevanceFieldEnum | NotificationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    kanbanId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    sentAt?: SortOrder
  }

  export type NotificationAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    kanbanId?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    kanbanId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    sentAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    kanbanId?: SortOrder
    type?: SortOrder
    message?: SortOrder
    sentAt?: SortOrder
  }

  export type NotificationSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    kanbanId?: SortOrder
  }

  export type DepartmentCreateNestedOneWithoutUsersInput = {
    create?: XOR<DepartmentCreateWithoutUsersInput, DepartmentUncheckedCreateWithoutUsersInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutUsersInput
    connect?: DepartmentWhereUniqueInput
  }

  export type RequestKanbanCreateNestedManyWithoutUserInput = {
    create?: XOR<RequestKanbanCreateWithoutUserInput, RequestKanbanUncheckedCreateWithoutUserInput> | RequestKanbanCreateWithoutUserInput[] | RequestKanbanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutUserInput | RequestKanbanCreateOrConnectWithoutUserInput[]
    createMany?: RequestKanbanCreateManyUserInputEnvelope
    connect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
  }

  export type PersetujuanCreateNestedManyWithoutUserInput = {
    create?: XOR<PersetujuanCreateWithoutUserInput, PersetujuanUncheckedCreateWithoutUserInput> | PersetujuanCreateWithoutUserInput[] | PersetujuanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutUserInput | PersetujuanCreateOrConnectWithoutUserInput[]
    createMany?: PersetujuanCreateManyUserInputEnvelope
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type RequestKanbanUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RequestKanbanCreateWithoutUserInput, RequestKanbanUncheckedCreateWithoutUserInput> | RequestKanbanCreateWithoutUserInput[] | RequestKanbanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutUserInput | RequestKanbanCreateOrConnectWithoutUserInput[]
    createMany?: RequestKanbanCreateManyUserInputEnvelope
    connect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
  }

  export type PersetujuanUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PersetujuanCreateWithoutUserInput, PersetujuanUncheckedCreateWithoutUserInput> | PersetujuanCreateWithoutUserInput[] | PersetujuanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutUserInput | PersetujuanCreateOrConnectWithoutUserInput[]
    createMany?: PersetujuanCreateManyUserInputEnvelope
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DepartmentUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<DepartmentCreateWithoutUsersInput, DepartmentUncheckedCreateWithoutUsersInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutUsersInput
    upsert?: DepartmentUpsertWithoutUsersInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutUsersInput, DepartmentUpdateWithoutUsersInput>, DepartmentUncheckedUpdateWithoutUsersInput>
  }

  export type RequestKanbanUpdateManyWithoutUserNestedInput = {
    create?: XOR<RequestKanbanCreateWithoutUserInput, RequestKanbanUncheckedCreateWithoutUserInput> | RequestKanbanCreateWithoutUserInput[] | RequestKanbanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutUserInput | RequestKanbanCreateOrConnectWithoutUserInput[]
    upsert?: RequestKanbanUpsertWithWhereUniqueWithoutUserInput | RequestKanbanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RequestKanbanCreateManyUserInputEnvelope
    set?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    disconnect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    delete?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    connect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    update?: RequestKanbanUpdateWithWhereUniqueWithoutUserInput | RequestKanbanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RequestKanbanUpdateManyWithWhereWithoutUserInput | RequestKanbanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RequestKanbanScalarWhereInput | RequestKanbanScalarWhereInput[]
  }

  export type PersetujuanUpdateManyWithoutUserNestedInput = {
    create?: XOR<PersetujuanCreateWithoutUserInput, PersetujuanUncheckedCreateWithoutUserInput> | PersetujuanCreateWithoutUserInput[] | PersetujuanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutUserInput | PersetujuanCreateOrConnectWithoutUserInput[]
    upsert?: PersetujuanUpsertWithWhereUniqueWithoutUserInput | PersetujuanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PersetujuanCreateManyUserInputEnvelope
    set?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    disconnect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    delete?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    update?: PersetujuanUpdateWithWhereUniqueWithoutUserInput | PersetujuanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PersetujuanUpdateManyWithWhereWithoutUserInput | PersetujuanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PersetujuanScalarWhereInput | PersetujuanScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RequestKanbanUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RequestKanbanCreateWithoutUserInput, RequestKanbanUncheckedCreateWithoutUserInput> | RequestKanbanCreateWithoutUserInput[] | RequestKanbanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutUserInput | RequestKanbanCreateOrConnectWithoutUserInput[]
    upsert?: RequestKanbanUpsertWithWhereUniqueWithoutUserInput | RequestKanbanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RequestKanbanCreateManyUserInputEnvelope
    set?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    disconnect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    delete?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    connect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    update?: RequestKanbanUpdateWithWhereUniqueWithoutUserInput | RequestKanbanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RequestKanbanUpdateManyWithWhereWithoutUserInput | RequestKanbanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RequestKanbanScalarWhereInput | RequestKanbanScalarWhereInput[]
  }

  export type PersetujuanUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PersetujuanCreateWithoutUserInput, PersetujuanUncheckedCreateWithoutUserInput> | PersetujuanCreateWithoutUserInput[] | PersetujuanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutUserInput | PersetujuanCreateOrConnectWithoutUserInput[]
    upsert?: PersetujuanUpsertWithWhereUniqueWithoutUserInput | PersetujuanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PersetujuanCreateManyUserInputEnvelope
    set?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    disconnect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    delete?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    update?: PersetujuanUpdateWithWhereUniqueWithoutUserInput | PersetujuanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PersetujuanUpdateManyWithWhereWithoutUserInput | PersetujuanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PersetujuanScalarWhereInput | PersetujuanScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput> | UserCreateWithoutDepartmentInput[] | UserUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDepartmentInput | UserCreateOrConnectWithoutDepartmentInput[]
    createMany?: UserCreateManyDepartmentInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type RequestKanbanCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<RequestKanbanCreateWithoutDepartmentInput, RequestKanbanUncheckedCreateWithoutDepartmentInput> | RequestKanbanCreateWithoutDepartmentInput[] | RequestKanbanUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutDepartmentInput | RequestKanbanCreateOrConnectWithoutDepartmentInput[]
    createMany?: RequestKanbanCreateManyDepartmentInputEnvelope
    connect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
  }

  export type PersetujuanCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<PersetujuanCreateWithoutDepartmentInput, PersetujuanUncheckedCreateWithoutDepartmentInput> | PersetujuanCreateWithoutDepartmentInput[] | PersetujuanUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutDepartmentInput | PersetujuanCreateOrConnectWithoutDepartmentInput[]
    createMany?: PersetujuanCreateManyDepartmentInputEnvelope
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput> | UserCreateWithoutDepartmentInput[] | UserUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDepartmentInput | UserCreateOrConnectWithoutDepartmentInput[]
    createMany?: UserCreateManyDepartmentInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type RequestKanbanUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<RequestKanbanCreateWithoutDepartmentInput, RequestKanbanUncheckedCreateWithoutDepartmentInput> | RequestKanbanCreateWithoutDepartmentInput[] | RequestKanbanUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutDepartmentInput | RequestKanbanCreateOrConnectWithoutDepartmentInput[]
    createMany?: RequestKanbanCreateManyDepartmentInputEnvelope
    connect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
  }

  export type PersetujuanUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<PersetujuanCreateWithoutDepartmentInput, PersetujuanUncheckedCreateWithoutDepartmentInput> | PersetujuanCreateWithoutDepartmentInput[] | PersetujuanUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutDepartmentInput | PersetujuanCreateOrConnectWithoutDepartmentInput[]
    createMany?: PersetujuanCreateManyDepartmentInputEnvelope
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput> | UserCreateWithoutDepartmentInput[] | UserUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDepartmentInput | UserCreateOrConnectWithoutDepartmentInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDepartmentInput | UserUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: UserCreateManyDepartmentInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDepartmentInput | UserUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDepartmentInput | UserUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type RequestKanbanUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<RequestKanbanCreateWithoutDepartmentInput, RequestKanbanUncheckedCreateWithoutDepartmentInput> | RequestKanbanCreateWithoutDepartmentInput[] | RequestKanbanUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutDepartmentInput | RequestKanbanCreateOrConnectWithoutDepartmentInput[]
    upsert?: RequestKanbanUpsertWithWhereUniqueWithoutDepartmentInput | RequestKanbanUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: RequestKanbanCreateManyDepartmentInputEnvelope
    set?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    disconnect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    delete?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    connect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    update?: RequestKanbanUpdateWithWhereUniqueWithoutDepartmentInput | RequestKanbanUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: RequestKanbanUpdateManyWithWhereWithoutDepartmentInput | RequestKanbanUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: RequestKanbanScalarWhereInput | RequestKanbanScalarWhereInput[]
  }

  export type PersetujuanUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<PersetujuanCreateWithoutDepartmentInput, PersetujuanUncheckedCreateWithoutDepartmentInput> | PersetujuanCreateWithoutDepartmentInput[] | PersetujuanUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutDepartmentInput | PersetujuanCreateOrConnectWithoutDepartmentInput[]
    upsert?: PersetujuanUpsertWithWhereUniqueWithoutDepartmentInput | PersetujuanUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: PersetujuanCreateManyDepartmentInputEnvelope
    set?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    disconnect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    delete?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    update?: PersetujuanUpdateWithWhereUniqueWithoutDepartmentInput | PersetujuanUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: PersetujuanUpdateManyWithWhereWithoutDepartmentInput | PersetujuanUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: PersetujuanScalarWhereInput | PersetujuanScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput> | UserCreateWithoutDepartmentInput[] | UserUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDepartmentInput | UserCreateOrConnectWithoutDepartmentInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDepartmentInput | UserUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: UserCreateManyDepartmentInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDepartmentInput | UserUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDepartmentInput | UserUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type RequestKanbanUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<RequestKanbanCreateWithoutDepartmentInput, RequestKanbanUncheckedCreateWithoutDepartmentInput> | RequestKanbanCreateWithoutDepartmentInput[] | RequestKanbanUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutDepartmentInput | RequestKanbanCreateOrConnectWithoutDepartmentInput[]
    upsert?: RequestKanbanUpsertWithWhereUniqueWithoutDepartmentInput | RequestKanbanUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: RequestKanbanCreateManyDepartmentInputEnvelope
    set?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    disconnect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    delete?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    connect?: RequestKanbanWhereUniqueInput | RequestKanbanWhereUniqueInput[]
    update?: RequestKanbanUpdateWithWhereUniqueWithoutDepartmentInput | RequestKanbanUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: RequestKanbanUpdateManyWithWhereWithoutDepartmentInput | RequestKanbanUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: RequestKanbanScalarWhereInput | RequestKanbanScalarWhereInput[]
  }

  export type PersetujuanUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<PersetujuanCreateWithoutDepartmentInput, PersetujuanUncheckedCreateWithoutDepartmentInput> | PersetujuanCreateWithoutDepartmentInput[] | PersetujuanUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutDepartmentInput | PersetujuanCreateOrConnectWithoutDepartmentInput[]
    upsert?: PersetujuanUpsertWithWhereUniqueWithoutDepartmentInput | PersetujuanUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: PersetujuanCreateManyDepartmentInputEnvelope
    set?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    disconnect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    delete?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    update?: PersetujuanUpdateWithWhereUniqueWithoutDepartmentInput | PersetujuanUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: PersetujuanUpdateManyWithWhereWithoutDepartmentInput | PersetujuanUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: PersetujuanScalarWhereInput | PersetujuanScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRequestKanbanInput = {
    create?: XOR<UserCreateWithoutRequestKanbanInput, UserUncheckedCreateWithoutRequestKanbanInput>
    connectOrCreate?: UserCreateOrConnectWithoutRequestKanbanInput
    connect?: UserWhereUniqueInput
  }

  export type DepartmentCreateNestedOneWithoutRequestKanbanInput = {
    create?: XOR<DepartmentCreateWithoutRequestKanbanInput, DepartmentUncheckedCreateWithoutRequestKanbanInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutRequestKanbanInput
    connect?: DepartmentWhereUniqueInput
  }

  export type PersetujuanCreateNestedManyWithoutRequestKanbanInput = {
    create?: XOR<PersetujuanCreateWithoutRequestKanbanInput, PersetujuanUncheckedCreateWithoutRequestKanbanInput> | PersetujuanCreateWithoutRequestKanbanInput[] | PersetujuanUncheckedCreateWithoutRequestKanbanInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutRequestKanbanInput | PersetujuanCreateOrConnectWithoutRequestKanbanInput[]
    createMany?: PersetujuanCreateManyRequestKanbanInputEnvelope
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutKanbanInput = {
    create?: XOR<NotificationCreateWithoutKanbanInput, NotificationUncheckedCreateWithoutKanbanInput> | NotificationCreateWithoutKanbanInput[] | NotificationUncheckedCreateWithoutKanbanInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutKanbanInput | NotificationCreateOrConnectWithoutKanbanInput[]
    createMany?: NotificationCreateManyKanbanInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type PersetujuanUncheckedCreateNestedManyWithoutRequestKanbanInput = {
    create?: XOR<PersetujuanCreateWithoutRequestKanbanInput, PersetujuanUncheckedCreateWithoutRequestKanbanInput> | PersetujuanCreateWithoutRequestKanbanInput[] | PersetujuanUncheckedCreateWithoutRequestKanbanInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutRequestKanbanInput | PersetujuanCreateOrConnectWithoutRequestKanbanInput[]
    createMany?: PersetujuanCreateManyRequestKanbanInputEnvelope
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutKanbanInput = {
    create?: XOR<NotificationCreateWithoutKanbanInput, NotificationUncheckedCreateWithoutKanbanInput> | NotificationCreateWithoutKanbanInput[] | NotificationUncheckedCreateWithoutKanbanInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutKanbanInput | NotificationCreateOrConnectWithoutKanbanInput[]
    createMany?: NotificationCreateManyKanbanInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.RequestStatus
  }

  export type UserUpdateOneRequiredWithoutRequestKanbanNestedInput = {
    create?: XOR<UserCreateWithoutRequestKanbanInput, UserUncheckedCreateWithoutRequestKanbanInput>
    connectOrCreate?: UserCreateOrConnectWithoutRequestKanbanInput
    upsert?: UserUpsertWithoutRequestKanbanInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRequestKanbanInput, UserUpdateWithoutRequestKanbanInput>, UserUncheckedUpdateWithoutRequestKanbanInput>
  }

  export type DepartmentUpdateOneRequiredWithoutRequestKanbanNestedInput = {
    create?: XOR<DepartmentCreateWithoutRequestKanbanInput, DepartmentUncheckedCreateWithoutRequestKanbanInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutRequestKanbanInput
    upsert?: DepartmentUpsertWithoutRequestKanbanInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutRequestKanbanInput, DepartmentUpdateWithoutRequestKanbanInput>, DepartmentUncheckedUpdateWithoutRequestKanbanInput>
  }

  export type PersetujuanUpdateManyWithoutRequestKanbanNestedInput = {
    create?: XOR<PersetujuanCreateWithoutRequestKanbanInput, PersetujuanUncheckedCreateWithoutRequestKanbanInput> | PersetujuanCreateWithoutRequestKanbanInput[] | PersetujuanUncheckedCreateWithoutRequestKanbanInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutRequestKanbanInput | PersetujuanCreateOrConnectWithoutRequestKanbanInput[]
    upsert?: PersetujuanUpsertWithWhereUniqueWithoutRequestKanbanInput | PersetujuanUpsertWithWhereUniqueWithoutRequestKanbanInput[]
    createMany?: PersetujuanCreateManyRequestKanbanInputEnvelope
    set?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    disconnect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    delete?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    update?: PersetujuanUpdateWithWhereUniqueWithoutRequestKanbanInput | PersetujuanUpdateWithWhereUniqueWithoutRequestKanbanInput[]
    updateMany?: PersetujuanUpdateManyWithWhereWithoutRequestKanbanInput | PersetujuanUpdateManyWithWhereWithoutRequestKanbanInput[]
    deleteMany?: PersetujuanScalarWhereInput | PersetujuanScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutKanbanNestedInput = {
    create?: XOR<NotificationCreateWithoutKanbanInput, NotificationUncheckedCreateWithoutKanbanInput> | NotificationCreateWithoutKanbanInput[] | NotificationUncheckedCreateWithoutKanbanInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutKanbanInput | NotificationCreateOrConnectWithoutKanbanInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutKanbanInput | NotificationUpsertWithWhereUniqueWithoutKanbanInput[]
    createMany?: NotificationCreateManyKanbanInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutKanbanInput | NotificationUpdateWithWhereUniqueWithoutKanbanInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutKanbanInput | NotificationUpdateManyWithWhereWithoutKanbanInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type PersetujuanUncheckedUpdateManyWithoutRequestKanbanNestedInput = {
    create?: XOR<PersetujuanCreateWithoutRequestKanbanInput, PersetujuanUncheckedCreateWithoutRequestKanbanInput> | PersetujuanCreateWithoutRequestKanbanInput[] | PersetujuanUncheckedCreateWithoutRequestKanbanInput[]
    connectOrCreate?: PersetujuanCreateOrConnectWithoutRequestKanbanInput | PersetujuanCreateOrConnectWithoutRequestKanbanInput[]
    upsert?: PersetujuanUpsertWithWhereUniqueWithoutRequestKanbanInput | PersetujuanUpsertWithWhereUniqueWithoutRequestKanbanInput[]
    createMany?: PersetujuanCreateManyRequestKanbanInputEnvelope
    set?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    disconnect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    delete?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    connect?: PersetujuanWhereUniqueInput | PersetujuanWhereUniqueInput[]
    update?: PersetujuanUpdateWithWhereUniqueWithoutRequestKanbanInput | PersetujuanUpdateWithWhereUniqueWithoutRequestKanbanInput[]
    updateMany?: PersetujuanUpdateManyWithWhereWithoutRequestKanbanInput | PersetujuanUpdateManyWithWhereWithoutRequestKanbanInput[]
    deleteMany?: PersetujuanScalarWhereInput | PersetujuanScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutKanbanNestedInput = {
    create?: XOR<NotificationCreateWithoutKanbanInput, NotificationUncheckedCreateWithoutKanbanInput> | NotificationCreateWithoutKanbanInput[] | NotificationUncheckedCreateWithoutKanbanInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutKanbanInput | NotificationCreateOrConnectWithoutKanbanInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutKanbanInput | NotificationUpsertWithWhereUniqueWithoutKanbanInput[]
    createMany?: NotificationCreateManyKanbanInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutKanbanInput | NotificationUpdateWithWhereUniqueWithoutKanbanInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutKanbanInput | NotificationUpdateManyWithWhereWithoutKanbanInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPersetujuanInput = {
    create?: XOR<UserCreateWithoutPersetujuanInput, UserUncheckedCreateWithoutPersetujuanInput>
    connectOrCreate?: UserCreateOrConnectWithoutPersetujuanInput
    connect?: UserWhereUniqueInput
  }

  export type DepartmentCreateNestedOneWithoutPersetujuanInput = {
    create?: XOR<DepartmentCreateWithoutPersetujuanInput, DepartmentUncheckedCreateWithoutPersetujuanInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutPersetujuanInput
    connect?: DepartmentWhereUniqueInput
  }

  export type RequestKanbanCreateNestedOneWithoutPersetujuanInput = {
    create?: XOR<RequestKanbanCreateWithoutPersetujuanInput, RequestKanbanUncheckedCreateWithoutPersetujuanInput>
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutPersetujuanInput
    connect?: RequestKanbanWhereUniqueInput
  }

  export type EnumApprovalRoleFieldUpdateOperationsInput = {
    set?: $Enums.ApprovalRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutPersetujuanNestedInput = {
    create?: XOR<UserCreateWithoutPersetujuanInput, UserUncheckedCreateWithoutPersetujuanInput>
    connectOrCreate?: UserCreateOrConnectWithoutPersetujuanInput
    upsert?: UserUpsertWithoutPersetujuanInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPersetujuanInput, UserUpdateWithoutPersetujuanInput>, UserUncheckedUpdateWithoutPersetujuanInput>
  }

  export type DepartmentUpdateOneRequiredWithoutPersetujuanNestedInput = {
    create?: XOR<DepartmentCreateWithoutPersetujuanInput, DepartmentUncheckedCreateWithoutPersetujuanInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutPersetujuanInput
    upsert?: DepartmentUpsertWithoutPersetujuanInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutPersetujuanInput, DepartmentUpdateWithoutPersetujuanInput>, DepartmentUncheckedUpdateWithoutPersetujuanInput>
  }

  export type RequestKanbanUpdateOneRequiredWithoutPersetujuanNestedInput = {
    create?: XOR<RequestKanbanCreateWithoutPersetujuanInput, RequestKanbanUncheckedCreateWithoutPersetujuanInput>
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutPersetujuanInput
    upsert?: RequestKanbanUpsertWithoutPersetujuanInput
    connect?: RequestKanbanWhereUniqueInput
    update?: XOR<XOR<RequestKanbanUpdateToOneWithWhereWithoutPersetujuanInput, RequestKanbanUpdateWithoutPersetujuanInput>, RequestKanbanUncheckedUpdateWithoutPersetujuanInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type RequestKanbanCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<RequestKanbanCreateWithoutNotificationsInput, RequestKanbanUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutNotificationsInput
    connect?: RequestKanbanWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type RequestKanbanUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<RequestKanbanCreateWithoutNotificationsInput, RequestKanbanUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: RequestKanbanCreateOrConnectWithoutNotificationsInput
    upsert?: RequestKanbanUpsertWithoutNotificationsInput
    connect?: RequestKanbanWhereUniqueInput
    update?: XOR<XOR<RequestKanbanUpdateToOneWithWhereWithoutNotificationsInput, RequestKanbanUpdateWithoutNotificationsInput>, RequestKanbanUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[]
    notIn?: $Enums.RequestStatus[]
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[]
    notIn?: $Enums.RequestStatus[]
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
  }

  export type NestedEnumApprovalRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.ApprovalRole | EnumApprovalRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ApprovalRole[]
    notIn?: $Enums.ApprovalRole[]
    not?: NestedEnumApprovalRoleFilter<$PrismaModel> | $Enums.ApprovalRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumApprovalRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApprovalRole | EnumApprovalRoleFieldRefInput<$PrismaModel>
    in?: $Enums.ApprovalRole[]
    notIn?: $Enums.ApprovalRole[]
    not?: NestedEnumApprovalRoleWithAggregatesFilter<$PrismaModel> | $Enums.ApprovalRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApprovalRoleFilter<$PrismaModel>
    _max?: NestedEnumApprovalRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DepartmentCreateWithoutUsersInput = {
    name: string
    requestKanban?: RequestKanbanCreateNestedManyWithoutDepartmentInput
    persetujuan?: PersetujuanCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateWithoutUsersInput = {
    id_department?: number
    name: string
    requestKanban?: RequestKanbanUncheckedCreateNestedManyWithoutDepartmentInput
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutUsersInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutUsersInput, DepartmentUncheckedCreateWithoutUsersInput>
  }

  export type RequestKanbanCreateWithoutUserInput = {
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    department: DepartmentCreateNestedOneWithoutRequestKanbanInput
    persetujuan?: PersetujuanCreateNestedManyWithoutRequestKanbanInput
    notifications?: NotificationCreateNestedManyWithoutKanbanInput
  }

  export type RequestKanbanUncheckedCreateWithoutUserInput = {
    id_kanban?: number
    id_department: number
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutRequestKanbanInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutKanbanInput
  }

  export type RequestKanbanCreateOrConnectWithoutUserInput = {
    where: RequestKanbanWhereUniqueInput
    create: XOR<RequestKanbanCreateWithoutUserInput, RequestKanbanUncheckedCreateWithoutUserInput>
  }

  export type RequestKanbanCreateManyUserInputEnvelope = {
    data: RequestKanbanCreateManyUserInput | RequestKanbanCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PersetujuanCreateWithoutUserInput = {
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
    department: DepartmentCreateNestedOneWithoutPersetujuanInput
    requestKanban: RequestKanbanCreateNestedOneWithoutPersetujuanInput
  }

  export type PersetujuanUncheckedCreateWithoutUserInput = {
    id_department: number
    id_kanban: number
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
  }

  export type PersetujuanCreateOrConnectWithoutUserInput = {
    where: PersetujuanWhereUniqueInput
    create: XOR<PersetujuanCreateWithoutUserInput, PersetujuanUncheckedCreateWithoutUserInput>
  }

  export type PersetujuanCreateManyUserInputEnvelope = {
    data: PersetujuanCreateManyUserInput | PersetujuanCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    type: string
    message: string
    sentAt?: Date | string
    kanban: RequestKanbanCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: number
    kanbanId: number
    type: string
    message: string
    sentAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DepartmentUpsertWithoutUsersInput = {
    update: XOR<DepartmentUpdateWithoutUsersInput, DepartmentUncheckedUpdateWithoutUsersInput>
    create: XOR<DepartmentCreateWithoutUsersInput, DepartmentUncheckedCreateWithoutUsersInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutUsersInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutUsersInput, DepartmentUncheckedUpdateWithoutUsersInput>
  }

  export type DepartmentUpdateWithoutUsersInput = {
    name?: StringFieldUpdateOperationsInput | string
    requestKanban?: RequestKanbanUpdateManyWithoutDepartmentNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutUsersInput = {
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    requestKanban?: RequestKanbanUncheckedUpdateManyWithoutDepartmentNestedInput
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type RequestKanbanUpsertWithWhereUniqueWithoutUserInput = {
    where: RequestKanbanWhereUniqueInput
    update: XOR<RequestKanbanUpdateWithoutUserInput, RequestKanbanUncheckedUpdateWithoutUserInput>
    create: XOR<RequestKanbanCreateWithoutUserInput, RequestKanbanUncheckedCreateWithoutUserInput>
  }

  export type RequestKanbanUpdateWithWhereUniqueWithoutUserInput = {
    where: RequestKanbanWhereUniqueInput
    data: XOR<RequestKanbanUpdateWithoutUserInput, RequestKanbanUncheckedUpdateWithoutUserInput>
  }

  export type RequestKanbanUpdateManyWithWhereWithoutUserInput = {
    where: RequestKanbanScalarWhereInput
    data: XOR<RequestKanbanUpdateManyMutationInput, RequestKanbanUncheckedUpdateManyWithoutUserInput>
  }

  export type RequestKanbanScalarWhereInput = {
    AND?: RequestKanbanScalarWhereInput | RequestKanbanScalarWhereInput[]
    OR?: RequestKanbanScalarWhereInput[]
    NOT?: RequestKanbanScalarWhereInput | RequestKanbanScalarWhereInput[]
    id_kanban?: IntFilter<"RequestKanban"> | number
    id_users?: IntFilter<"RequestKanban"> | number
    id_department?: IntFilter<"RequestKanban"> | number
    tgl_produksi?: DateTimeFilter<"RequestKanban"> | Date | string
    parts_number?: StringFilter<"RequestKanban"> | string
    lokasi?: StringFilter<"RequestKanban"> | string
    box?: StringFilter<"RequestKanban"> | string
    klasifikasi?: StringFilter<"RequestKanban"> | string
    keterangan?: StringFilter<"RequestKanban"> | string
    status?: EnumRequestStatusFilter<"RequestKanban"> | $Enums.RequestStatus
  }

  export type PersetujuanUpsertWithWhereUniqueWithoutUserInput = {
    where: PersetujuanWhereUniqueInput
    update: XOR<PersetujuanUpdateWithoutUserInput, PersetujuanUncheckedUpdateWithoutUserInput>
    create: XOR<PersetujuanCreateWithoutUserInput, PersetujuanUncheckedCreateWithoutUserInput>
  }

  export type PersetujuanUpdateWithWhereUniqueWithoutUserInput = {
    where: PersetujuanWhereUniqueInput
    data: XOR<PersetujuanUpdateWithoutUserInput, PersetujuanUncheckedUpdateWithoutUserInput>
  }

  export type PersetujuanUpdateManyWithWhereWithoutUserInput = {
    where: PersetujuanScalarWhereInput
    data: XOR<PersetujuanUpdateManyMutationInput, PersetujuanUncheckedUpdateManyWithoutUserInput>
  }

  export type PersetujuanScalarWhereInput = {
    AND?: PersetujuanScalarWhereInput | PersetujuanScalarWhereInput[]
    OR?: PersetujuanScalarWhereInput[]
    NOT?: PersetujuanScalarWhereInput | PersetujuanScalarWhereInput[]
    id_users?: IntFilter<"Persetujuan"> | number
    id_department?: IntFilter<"Persetujuan"> | number
    id_kanban?: IntFilter<"Persetujuan"> | number
    role?: EnumApprovalRoleFilter<"Persetujuan"> | $Enums.ApprovalRole
    approve?: BoolFilter<"Persetujuan"> | boolean
    approvedAt?: DateTimeNullableFilter<"Persetujuan"> | Date | string | null
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    kanbanId?: IntFilter<"Notification"> | number
    type?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    sentAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UserCreateWithoutDepartmentInput = {
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    requestKanban?: RequestKanbanCreateNestedManyWithoutUserInput
    persetujuan?: PersetujuanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDepartmentInput = {
    id_users?: number
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    requestKanban?: RequestKanbanUncheckedCreateNestedManyWithoutUserInput
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDepartmentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput>
  }

  export type UserCreateManyDepartmentInputEnvelope = {
    data: UserCreateManyDepartmentInput | UserCreateManyDepartmentInput[]
    skipDuplicates?: boolean
  }

  export type RequestKanbanCreateWithoutDepartmentInput = {
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    user: UserCreateNestedOneWithoutRequestKanbanInput
    persetujuan?: PersetujuanCreateNestedManyWithoutRequestKanbanInput
    notifications?: NotificationCreateNestedManyWithoutKanbanInput
  }

  export type RequestKanbanUncheckedCreateWithoutDepartmentInput = {
    id_kanban?: number
    id_users: number
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutRequestKanbanInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutKanbanInput
  }

  export type RequestKanbanCreateOrConnectWithoutDepartmentInput = {
    where: RequestKanbanWhereUniqueInput
    create: XOR<RequestKanbanCreateWithoutDepartmentInput, RequestKanbanUncheckedCreateWithoutDepartmentInput>
  }

  export type RequestKanbanCreateManyDepartmentInputEnvelope = {
    data: RequestKanbanCreateManyDepartmentInput | RequestKanbanCreateManyDepartmentInput[]
    skipDuplicates?: boolean
  }

  export type PersetujuanCreateWithoutDepartmentInput = {
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPersetujuanInput
    requestKanban: RequestKanbanCreateNestedOneWithoutPersetujuanInput
  }

  export type PersetujuanUncheckedCreateWithoutDepartmentInput = {
    id_users: number
    id_kanban: number
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
  }

  export type PersetujuanCreateOrConnectWithoutDepartmentInput = {
    where: PersetujuanWhereUniqueInput
    create: XOR<PersetujuanCreateWithoutDepartmentInput, PersetujuanUncheckedCreateWithoutDepartmentInput>
  }

  export type PersetujuanCreateManyDepartmentInputEnvelope = {
    data: PersetujuanCreateManyDepartmentInput | PersetujuanCreateManyDepartmentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutDepartmentInput, UserUncheckedUpdateWithoutDepartmentInput>
    create: XOR<UserCreateWithoutDepartmentInput, UserUncheckedCreateWithoutDepartmentInput>
  }

  export type UserUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutDepartmentInput, UserUncheckedUpdateWithoutDepartmentInput>
  }

  export type UserUpdateManyWithWhereWithoutDepartmentInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id_users?: IntFilter<"User"> | number
    id_department?: IntFilter<"User"> | number
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    email?: StringFilter<"User"> | string
    no_hp?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
  }

  export type RequestKanbanUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: RequestKanbanWhereUniqueInput
    update: XOR<RequestKanbanUpdateWithoutDepartmentInput, RequestKanbanUncheckedUpdateWithoutDepartmentInput>
    create: XOR<RequestKanbanCreateWithoutDepartmentInput, RequestKanbanUncheckedCreateWithoutDepartmentInput>
  }

  export type RequestKanbanUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: RequestKanbanWhereUniqueInput
    data: XOR<RequestKanbanUpdateWithoutDepartmentInput, RequestKanbanUncheckedUpdateWithoutDepartmentInput>
  }

  export type RequestKanbanUpdateManyWithWhereWithoutDepartmentInput = {
    where: RequestKanbanScalarWhereInput
    data: XOR<RequestKanbanUpdateManyMutationInput, RequestKanbanUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type PersetujuanUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: PersetujuanWhereUniqueInput
    update: XOR<PersetujuanUpdateWithoutDepartmentInput, PersetujuanUncheckedUpdateWithoutDepartmentInput>
    create: XOR<PersetujuanCreateWithoutDepartmentInput, PersetujuanUncheckedCreateWithoutDepartmentInput>
  }

  export type PersetujuanUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: PersetujuanWhereUniqueInput
    data: XOR<PersetujuanUpdateWithoutDepartmentInput, PersetujuanUncheckedUpdateWithoutDepartmentInput>
  }

  export type PersetujuanUpdateManyWithWhereWithoutDepartmentInput = {
    where: PersetujuanScalarWhereInput
    data: XOR<PersetujuanUpdateManyMutationInput, PersetujuanUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type UserCreateWithoutRequestKanbanInput = {
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    department: DepartmentCreateNestedOneWithoutUsersInput
    persetujuan?: PersetujuanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRequestKanbanInput = {
    id_users?: number
    id_department: number
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRequestKanbanInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRequestKanbanInput, UserUncheckedCreateWithoutRequestKanbanInput>
  }

  export type DepartmentCreateWithoutRequestKanbanInput = {
    name: string
    users?: UserCreateNestedManyWithoutDepartmentInput
    persetujuan?: PersetujuanCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateWithoutRequestKanbanInput = {
    id_department?: number
    name: string
    users?: UserUncheckedCreateNestedManyWithoutDepartmentInput
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutRequestKanbanInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutRequestKanbanInput, DepartmentUncheckedCreateWithoutRequestKanbanInput>
  }

  export type PersetujuanCreateWithoutRequestKanbanInput = {
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPersetujuanInput
    department: DepartmentCreateNestedOneWithoutPersetujuanInput
  }

  export type PersetujuanUncheckedCreateWithoutRequestKanbanInput = {
    id_users: number
    id_department: number
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
  }

  export type PersetujuanCreateOrConnectWithoutRequestKanbanInput = {
    where: PersetujuanWhereUniqueInput
    create: XOR<PersetujuanCreateWithoutRequestKanbanInput, PersetujuanUncheckedCreateWithoutRequestKanbanInput>
  }

  export type PersetujuanCreateManyRequestKanbanInputEnvelope = {
    data: PersetujuanCreateManyRequestKanbanInput | PersetujuanCreateManyRequestKanbanInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutKanbanInput = {
    type: string
    message: string
    sentAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutKanbanInput = {
    id?: number
    userId: number
    type: string
    message: string
    sentAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutKanbanInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutKanbanInput, NotificationUncheckedCreateWithoutKanbanInput>
  }

  export type NotificationCreateManyKanbanInputEnvelope = {
    data: NotificationCreateManyKanbanInput | NotificationCreateManyKanbanInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutRequestKanbanInput = {
    update: XOR<UserUpdateWithoutRequestKanbanInput, UserUncheckedUpdateWithoutRequestKanbanInput>
    create: XOR<UserCreateWithoutRequestKanbanInput, UserUncheckedCreateWithoutRequestKanbanInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRequestKanbanInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRequestKanbanInput, UserUncheckedUpdateWithoutRequestKanbanInput>
  }

  export type UserUpdateWithoutRequestKanbanInput = {
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    department?: DepartmentUpdateOneRequiredWithoutUsersNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRequestKanbanInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DepartmentUpsertWithoutRequestKanbanInput = {
    update: XOR<DepartmentUpdateWithoutRequestKanbanInput, DepartmentUncheckedUpdateWithoutRequestKanbanInput>
    create: XOR<DepartmentCreateWithoutRequestKanbanInput, DepartmentUncheckedCreateWithoutRequestKanbanInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutRequestKanbanInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutRequestKanbanInput, DepartmentUncheckedUpdateWithoutRequestKanbanInput>
  }

  export type DepartmentUpdateWithoutRequestKanbanInput = {
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUpdateManyWithoutDepartmentNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutRequestKanbanInput = {
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUncheckedUpdateManyWithoutDepartmentNestedInput
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type PersetujuanUpsertWithWhereUniqueWithoutRequestKanbanInput = {
    where: PersetujuanWhereUniqueInput
    update: XOR<PersetujuanUpdateWithoutRequestKanbanInput, PersetujuanUncheckedUpdateWithoutRequestKanbanInput>
    create: XOR<PersetujuanCreateWithoutRequestKanbanInput, PersetujuanUncheckedCreateWithoutRequestKanbanInput>
  }

  export type PersetujuanUpdateWithWhereUniqueWithoutRequestKanbanInput = {
    where: PersetujuanWhereUniqueInput
    data: XOR<PersetujuanUpdateWithoutRequestKanbanInput, PersetujuanUncheckedUpdateWithoutRequestKanbanInput>
  }

  export type PersetujuanUpdateManyWithWhereWithoutRequestKanbanInput = {
    where: PersetujuanScalarWhereInput
    data: XOR<PersetujuanUpdateManyMutationInput, PersetujuanUncheckedUpdateManyWithoutRequestKanbanInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutKanbanInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutKanbanInput, NotificationUncheckedUpdateWithoutKanbanInput>
    create: XOR<NotificationCreateWithoutKanbanInput, NotificationUncheckedCreateWithoutKanbanInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutKanbanInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutKanbanInput, NotificationUncheckedUpdateWithoutKanbanInput>
  }

  export type NotificationUpdateManyWithWhereWithoutKanbanInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutKanbanInput>
  }

  export type UserCreateWithoutPersetujuanInput = {
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    department: DepartmentCreateNestedOneWithoutUsersInput
    requestKanban?: RequestKanbanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPersetujuanInput = {
    id_users?: number
    id_department: number
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    requestKanban?: RequestKanbanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPersetujuanInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPersetujuanInput, UserUncheckedCreateWithoutPersetujuanInput>
  }

  export type DepartmentCreateWithoutPersetujuanInput = {
    name: string
    users?: UserCreateNestedManyWithoutDepartmentInput
    requestKanban?: RequestKanbanCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateWithoutPersetujuanInput = {
    id_department?: number
    name: string
    users?: UserUncheckedCreateNestedManyWithoutDepartmentInput
    requestKanban?: RequestKanbanUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutPersetujuanInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutPersetujuanInput, DepartmentUncheckedCreateWithoutPersetujuanInput>
  }

  export type RequestKanbanCreateWithoutPersetujuanInput = {
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    user: UserCreateNestedOneWithoutRequestKanbanInput
    department: DepartmentCreateNestedOneWithoutRequestKanbanInput
    notifications?: NotificationCreateNestedManyWithoutKanbanInput
  }

  export type RequestKanbanUncheckedCreateWithoutPersetujuanInput = {
    id_kanban?: number
    id_users: number
    id_department: number
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    notifications?: NotificationUncheckedCreateNestedManyWithoutKanbanInput
  }

  export type RequestKanbanCreateOrConnectWithoutPersetujuanInput = {
    where: RequestKanbanWhereUniqueInput
    create: XOR<RequestKanbanCreateWithoutPersetujuanInput, RequestKanbanUncheckedCreateWithoutPersetujuanInput>
  }

  export type UserUpsertWithoutPersetujuanInput = {
    update: XOR<UserUpdateWithoutPersetujuanInput, UserUncheckedUpdateWithoutPersetujuanInput>
    create: XOR<UserCreateWithoutPersetujuanInput, UserUncheckedCreateWithoutPersetujuanInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPersetujuanInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPersetujuanInput, UserUncheckedUpdateWithoutPersetujuanInput>
  }

  export type UserUpdateWithoutPersetujuanInput = {
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    department?: DepartmentUpdateOneRequiredWithoutUsersNestedInput
    requestKanban?: RequestKanbanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPersetujuanInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    requestKanban?: RequestKanbanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DepartmentUpsertWithoutPersetujuanInput = {
    update: XOR<DepartmentUpdateWithoutPersetujuanInput, DepartmentUncheckedUpdateWithoutPersetujuanInput>
    create: XOR<DepartmentCreateWithoutPersetujuanInput, DepartmentUncheckedCreateWithoutPersetujuanInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutPersetujuanInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutPersetujuanInput, DepartmentUncheckedUpdateWithoutPersetujuanInput>
  }

  export type DepartmentUpdateWithoutPersetujuanInput = {
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUpdateManyWithoutDepartmentNestedInput
    requestKanban?: RequestKanbanUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutPersetujuanInput = {
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUncheckedUpdateManyWithoutDepartmentNestedInput
    requestKanban?: RequestKanbanUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type RequestKanbanUpsertWithoutPersetujuanInput = {
    update: XOR<RequestKanbanUpdateWithoutPersetujuanInput, RequestKanbanUncheckedUpdateWithoutPersetujuanInput>
    create: XOR<RequestKanbanCreateWithoutPersetujuanInput, RequestKanbanUncheckedCreateWithoutPersetujuanInput>
    where?: RequestKanbanWhereInput
  }

  export type RequestKanbanUpdateToOneWithWhereWithoutPersetujuanInput = {
    where?: RequestKanbanWhereInput
    data: XOR<RequestKanbanUpdateWithoutPersetujuanInput, RequestKanbanUncheckedUpdateWithoutPersetujuanInput>
  }

  export type RequestKanbanUpdateWithoutPersetujuanInput = {
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    user?: UserUpdateOneRequiredWithoutRequestKanbanNestedInput
    department?: DepartmentUpdateOneRequiredWithoutRequestKanbanNestedInput
    notifications?: NotificationUpdateManyWithoutKanbanNestedInput
  }

  export type RequestKanbanUncheckedUpdateWithoutPersetujuanInput = {
    id_kanban?: IntFieldUpdateOperationsInput | number
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    notifications?: NotificationUncheckedUpdateManyWithoutKanbanNestedInput
  }

  export type UserCreateWithoutNotificationsInput = {
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    department: DepartmentCreateNestedOneWithoutUsersInput
    requestKanban?: RequestKanbanCreateNestedManyWithoutUserInput
    persetujuan?: PersetujuanCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id_users?: number
    id_department: number
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
    requestKanban?: RequestKanbanUncheckedCreateNestedManyWithoutUserInput
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type RequestKanbanCreateWithoutNotificationsInput = {
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    user: UserCreateNestedOneWithoutRequestKanbanInput
    department: DepartmentCreateNestedOneWithoutRequestKanbanInput
    persetujuan?: PersetujuanCreateNestedManyWithoutRequestKanbanInput
  }

  export type RequestKanbanUncheckedCreateWithoutNotificationsInput = {
    id_kanban?: number
    id_users: number
    id_department: number
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
    persetujuan?: PersetujuanUncheckedCreateNestedManyWithoutRequestKanbanInput
  }

  export type RequestKanbanCreateOrConnectWithoutNotificationsInput = {
    where: RequestKanbanWhereUniqueInput
    create: XOR<RequestKanbanCreateWithoutNotificationsInput, RequestKanbanUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    department?: DepartmentUpdateOneRequiredWithoutUsersNestedInput
    requestKanban?: RequestKanbanUpdateManyWithoutUserNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    requestKanban?: RequestKanbanUncheckedUpdateManyWithoutUserNestedInput
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RequestKanbanUpsertWithoutNotificationsInput = {
    update: XOR<RequestKanbanUpdateWithoutNotificationsInput, RequestKanbanUncheckedUpdateWithoutNotificationsInput>
    create: XOR<RequestKanbanCreateWithoutNotificationsInput, RequestKanbanUncheckedCreateWithoutNotificationsInput>
    where?: RequestKanbanWhereInput
  }

  export type RequestKanbanUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: RequestKanbanWhereInput
    data: XOR<RequestKanbanUpdateWithoutNotificationsInput, RequestKanbanUncheckedUpdateWithoutNotificationsInput>
  }

  export type RequestKanbanUpdateWithoutNotificationsInput = {
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    user?: UserUpdateOneRequiredWithoutRequestKanbanNestedInput
    department?: DepartmentUpdateOneRequiredWithoutRequestKanbanNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutRequestKanbanNestedInput
  }

  export type RequestKanbanUncheckedUpdateWithoutNotificationsInput = {
    id_kanban?: IntFieldUpdateOperationsInput | number
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutRequestKanbanNestedInput
  }

  export type RequestKanbanCreateManyUserInput = {
    id_kanban?: number
    id_department: number
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
  }

  export type PersetujuanCreateManyUserInput = {
    id_department: number
    id_kanban: number
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
  }

  export type NotificationCreateManyUserInput = {
    id?: number
    kanbanId: number
    type: string
    message: string
    sentAt?: Date | string
  }

  export type RequestKanbanUpdateWithoutUserInput = {
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    department?: DepartmentUpdateOneRequiredWithoutRequestKanbanNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutRequestKanbanNestedInput
    notifications?: NotificationUpdateManyWithoutKanbanNestedInput
  }

  export type RequestKanbanUncheckedUpdateWithoutUserInput = {
    id_kanban?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutRequestKanbanNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutKanbanNestedInput
  }

  export type RequestKanbanUncheckedUpdateManyWithoutUserInput = {
    id_kanban?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type PersetujuanUpdateWithoutUserInput = {
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    department?: DepartmentUpdateOneRequiredWithoutPersetujuanNestedInput
    requestKanban?: RequestKanbanUpdateOneRequiredWithoutPersetujuanNestedInput
  }

  export type PersetujuanUncheckedUpdateWithoutUserInput = {
    id_department?: IntFieldUpdateOperationsInput | number
    id_kanban?: IntFieldUpdateOperationsInput | number
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersetujuanUncheckedUpdateManyWithoutUserInput = {
    id_department?: IntFieldUpdateOperationsInput | number
    id_kanban?: IntFieldUpdateOperationsInput | number
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    kanban?: RequestKanbanUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    kanbanId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    kanbanId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyDepartmentInput = {
    id_users?: number
    name: string
    role: $Enums.Role
    email: string
    no_hp: string
    password: string
  }

  export type RequestKanbanCreateManyDepartmentInput = {
    id_kanban?: number
    id_users: number
    tgl_produksi: Date | string
    parts_number: string
    lokasi: string
    box: string
    klasifikasi: string
    keterangan: string
    status?: $Enums.RequestStatus
  }

  export type PersetujuanCreateManyDepartmentInput = {
    id_users: number
    id_kanban: number
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
  }

  export type UserUpdateWithoutDepartmentInput = {
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    requestKanban?: RequestKanbanUpdateManyWithoutUserNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDepartmentInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    requestKanban?: RequestKanbanUncheckedUpdateManyWithoutUserNestedInput
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutDepartmentInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    email?: StringFieldUpdateOperationsInput | string
    no_hp?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type RequestKanbanUpdateWithoutDepartmentInput = {
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    user?: UserUpdateOneRequiredWithoutRequestKanbanNestedInput
    persetujuan?: PersetujuanUpdateManyWithoutRequestKanbanNestedInput
    notifications?: NotificationUpdateManyWithoutKanbanNestedInput
  }

  export type RequestKanbanUncheckedUpdateWithoutDepartmentInput = {
    id_kanban?: IntFieldUpdateOperationsInput | number
    id_users?: IntFieldUpdateOperationsInput | number
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    persetujuan?: PersetujuanUncheckedUpdateManyWithoutRequestKanbanNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutKanbanNestedInput
  }

  export type RequestKanbanUncheckedUpdateManyWithoutDepartmentInput = {
    id_kanban?: IntFieldUpdateOperationsInput | number
    id_users?: IntFieldUpdateOperationsInput | number
    tgl_produksi?: DateTimeFieldUpdateOperationsInput | Date | string
    parts_number?: StringFieldUpdateOperationsInput | string
    lokasi?: StringFieldUpdateOperationsInput | string
    box?: StringFieldUpdateOperationsInput | string
    klasifikasi?: StringFieldUpdateOperationsInput | string
    keterangan?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
  }

  export type PersetujuanUpdateWithoutDepartmentInput = {
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPersetujuanNestedInput
    requestKanban?: RequestKanbanUpdateOneRequiredWithoutPersetujuanNestedInput
  }

  export type PersetujuanUncheckedUpdateWithoutDepartmentInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_kanban?: IntFieldUpdateOperationsInput | number
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersetujuanUncheckedUpdateManyWithoutDepartmentInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_kanban?: IntFieldUpdateOperationsInput | number
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersetujuanCreateManyRequestKanbanInput = {
    id_users: number
    id_department: number
    role: $Enums.ApprovalRole
    approve: boolean
    approvedAt?: Date | string | null
  }

  export type NotificationCreateManyKanbanInput = {
    id?: number
    userId: number
    type: string
    message: string
    sentAt?: Date | string
  }

  export type PersetujuanUpdateWithoutRequestKanbanInput = {
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPersetujuanNestedInput
    department?: DepartmentUpdateOneRequiredWithoutPersetujuanNestedInput
  }

  export type PersetujuanUncheckedUpdateWithoutRequestKanbanInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PersetujuanUncheckedUpdateManyWithoutRequestKanbanInput = {
    id_users?: IntFieldUpdateOperationsInput | number
    id_department?: IntFieldUpdateOperationsInput | number
    role?: EnumApprovalRoleFieldUpdateOperationsInput | $Enums.ApprovalRole
    approve?: BoolFieldUpdateOperationsInput | boolean
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationUpdateWithoutKanbanInput = {
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutKanbanInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutKanbanInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}