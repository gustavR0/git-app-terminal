import { confirm, intro, isCancel, multiselect, outro, select, text } from '@clack/prompts'
import { COMMIT_TYPES } from './commit-types.js'
import colors from 'picocolors'
import { getChangedFiles, getStagedFiles, gitAdd, gitCommit } from './git.js'
import { trytm } from '@bdsqqq/try'

const [changeFiles, errorChangedFiles] = await trytm(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles())

intro(
  colors.inverse(`Asisstente para creación de commits por ${colors.yellow('@gustavR0')}`)
)

if (errorChangedFiles ?? errorStagedFiles) {
  outro(colors.red('Error: Comprueba que estas en un respositorio de git'))
  process.exit(1)
}

if (stagedFiles.length === 0 && changeFiles.length > 0) {
  // TODO: selecionar los archivos a los que les quieres hacer commit
  const files = await multiselect({
    message: colors.cyan('Seleccione los archivos que quiere añadir al commit'),
    options: changeFiles.map((files) => ({
      value: files,
      label: files
    }))
  })

  if (isCancel(files)) {
    outro(colors.yellow('Se a terminado la ejecución'))
    process.exit(0)
  }

  await gitAdd({ files })
}

const commitTye = await select({
  message: colors.cyan('Selecciona tipo de commit'),
  options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} ${key.padEnd(8, ' ')} - ${value.description}`
  }))
})

const commitMsg = await text({
  message: colors.cyan('introduce el mensaje del commit:'),
  validate: (value) => {
    if (value.length === 0) {
      return colors.red('El commit no puede ir vacio')
    }
    if (value.length > 50) {
      return colors.red('El commit no puede tener más de 50 caracteres')
    }
  }
})

const { emoji, release } = COMMIT_TYPES[commitTye]

let breakingChange = false
if (release) {
  breakingChange = await confirm({
    initialValue: false,
    message: `${colors.cyan('¿Tienes este commit con cambios que rompen la compatibilidad anteiro?')}
      
    ${colors.gray('Si la respues es si, deberias crear un commit con el tipo "BREAKING CHANGE" y al hacer release se publicará una versión mejor')}
    `
  })
}

let commit = `${emoji} ${commitTye}: ${commitMsg}`
commit = breakingChange ? `${commit} [breaking change]` : commit

const shouldContinue = await confirm({
  initialValue: true,
  message: `${colors.cyan('¿Quieres crear el commit con el siguiente mensaje?')} 
    
  ${colors.yellow(colors.bold(commit))}
  `
})

if (!shouldContinue) {
  outro(colors.yellow('No se ha creado el commit'))
  process.exit(0)
}

await gitCommit({ commit })

outro(
  colors.green('✔️  Commit creado con exito, Gracias por usar el asistente')
)
