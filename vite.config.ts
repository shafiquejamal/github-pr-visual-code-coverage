import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
	build: {
		outDir: 'build',
		rollupOptions: {
			input: {
				background: path.resolve(__dirname, 'src/scripts/background.ts'),
				content: path.resolve(__dirname, 'src/scripts/content.ts'),
				popup: path.resolve(__dirname, 'src/scripts/popup.ts'),
				credentials: path.resolve(__dirname, 'src/scripts/credentials.ts'),
				customization: path.resolve(__dirname, 'src/scripts/customization.ts'),
				['data-cache']: path.resolve(__dirname, 'src/scripts/data-cache.ts')
			},
			output: {
				entryFileNames: 'scripts/[name].js',
				chunkFileNames: 'scripts/[name].js'
			}
		},
		emptyOutDir: true
	}
})
