import type ts from 'typescript'
import { defaultValidationKeywords, getDefaultArgs } from './config'
import { getClassDefinition } from './definition/class-definition'
import { parseCommentsIntoDefinition } from './definition/comment-definition'
import { getEnumDefinition } from './definition/enum-definition'
import { getIntersectionDefinition } from './definition/intersection-definition'
import { getDefinitionForProperty } from './definition/property-definition'
import {
  getDefinitionForRootType,
  getTypeDefinition,
} from './definition/type-definition'
import { getUnionDefinition } from './definition/union-definition'
import { JsonSchemaContext } from './schema-context'
import type { Definition, ObjectMap, SchemaArgs, SymbolRef } from './types'

export class JsonSchemaGenerator {
  private readonly context: JsonSchemaContext

  constructor(
    symbols: Readonly<SymbolRef[]>,
    allSymbols: Readonly<ObjectMap<ts.Type>>,
    userSymbols: Readonly<ObjectMap<ts.Symbol>>,
    inheritingTypes: Readonly<ObjectMap<string[]>>,
    checker: ts.TypeChecker,
    args: SchemaArgs = getDefaultArgs(),
  ) {
    const validationKeywords = { ...defaultValidationKeywords }
    const context = new JsonSchemaContext(
      validationKeywords,
      symbols,
      allSymbols,
      userSymbols,
      inheritingTypes,
      checker,
      args,
    )
    this.context = context
  }

  public setSchemaOverride(symbolName: string, schema: Definition): void {
    this.context.setSchemaOverride(symbolName, schema)
  }

  public getSchemaForSymbol(
    symbolName: string,
    includeReffedDefinitions = true,
  ): Definition {
    return this.context.getSchemaForSymbol(symbolName, includeReffedDefinitions)
  }

  public getSchemaForSymbols(
    symbolNames: string[],
    includeReffedDefinitions = true,
  ): Definition {
    return this.context.getSchemaForSymbols(
      symbolNames,
      includeReffedDefinitions,
    )
  }

  public getSymbols(name?: string): SymbolRef[] {
    return this.context.getSymbols(name)
  }

  public getUserSymbols(name?: string): string[] {
    return this.context.getUserSymbols(name)
  }

  public getMainFileSymbols(
    program: ts.Program,
    onlyIncludeFiles?: string[],
  ): string[] {
    return this.context.getMainFileSymbols(program, onlyIncludeFiles)
  }

  public getClassDefinition(
    clazzType: ts.Type,
    definition: Definition = {},
  ): Definition {
    getClassDefinition(this.context, clazzType, definition)
    return definition
  }

  public getEnumDefinition(
    clazzType: ts.Type,
    definition: Definition = {},
  ): Definition {
    getEnumDefinition(this.context, clazzType, definition)
    return definition
  }

  public getIntersectionDefinition(
    intersectionType: ts.IntersectionType,
    definition: Definition = {},
  ): Definition {
    getIntersectionDefinition(this.context, intersectionType, definition)
    return definition
  }

  public getDefinitionForProperty(
    prop: ts.Symbol,
    node: ts.Node,
  ): Definition | null {
    return getDefinitionForProperty(this.context, prop, node)
  }

  public getUnionDefinition(
    unionType: ts.UnionType,
    prop: ts.Symbol,
    unionModifier: string,
    definition: Definition = {},
  ): Definition {
    getUnionDefinition(this.context, unionType, prop, unionModifier, definition)
    return definition
  }

  public getTypeDefinition(
    type: ts.Type,
    asRef?: boolean,
    unionModifier = 'anyOf',
    prop?: ts.Symbol,
    reffedType?: ts.Symbol,
    pairedSymbol?: ts.Symbol,
  ): Definition {
    return getTypeDefinition(
      this.context,
      type,
      asRef,
      unionModifier,
      prop,
      reffedType,
      pairedSymbol,
    )
  }

  public getDefinitionForRootType(
    propertyType: ts.Type,
    reffedType: ts.Symbol,
    definition: Definition = {},
  ): Definition {
    getDefinitionForRootType(this.context, propertyType, reffedType, definition)
    return definition
  }

  public parseCommentsIntoDefinition(
    symbol: ts.Symbol,
    definition: { description?: string },
    // eslint-disable-next-line @typescript-eslint/ban-types
    otherAnnotations: {},
  ): void {
    parseCommentsIntoDefinition(
      this.context,
      symbol,
      definition,
      otherAnnotations,
    )
  }
}
