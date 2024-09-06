import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '~/components/alerts';
import { Button } from '~/components/buttons';
import { SEO } from '~/components/layout';
import { addProperty } from '~/services';
import { useStore } from '~/store';

const BulkProperty = () => {
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);
    const [data, setData] = useState([]);
    const { loading, setLoading } = useStore();
    const [current, setCurrent] = useState(1);

    const throwFileError = (event, message) => {
        alert(message);
        setData([]);
        event.target.value = '';
        return;
    }

    const onChange = (event) => {
        const file = event.target.files[0];
        if (file.type !== 'text/csv') {
            return throwFileError(event, `You must select a CSV file`);
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const rows = text.split('\n');
            const parsedData = rows.map(row => row.split(',').map(cell => cell.trim()));
            const headers = parsedData[0];
            if (headers?.[0] !== 'name' || headers?.[1] !== 'url' || headers?.[2] !== 'type') {
                return throwFileError(event, `You must have the first row headers set to "name", "url", and "type"`);
            }
            const parsedRows = parsedData.slice(1, parsedData.length);
            for (const row of parsedRows) {
                if (!['single', 'sitemap'].includes(row?.[2])) {
                    return throwFileError(event, `You must specify the "type" for each row (valid values are "single" or "sitemap")`);
                }
                try {
                    const url = new URL(row?.[1]);
                    if (!['http:', 'https:'].includes(url.protocol)) {
                        return throwFileError(event, `All "urls" must use begin with either "http" or "https"`);
                    }
                    if (!url.host.includes('.')) {
                        return throwFileError(event, `All "urls" must end with a valid domain extension (i.e. ".com", ".org", etc)`);
                    }
                }
                catch (err) {
                    return throwFileError(event, `You have an invalid URL in your CSV`);
                }
            }
            setData(parsedData);
        };
        reader.readAsText(file);
        return;
    }

    useEffect(() => {
        if (data?.length > 0) {
            setIsFormValid(true);
        }
        else {
            setIsFormValid(false);
        }
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        setLoading(true);

        try {
            const successes = [];
            const errors = [];
            for (const [index, row] of data.slice(1, data.length).entries()) {
                setCurrent(index);
                try {
                    const response = await addProperty(row[0], row[1], row[2]);
                    console.log(response);
                    successes.push(row);
                }
                catch (err) {
                    errors.push(row);
                }
            }
            setLoading(false);
            toast.success({ title: 'Success', description: 'Properties added successfully!' });
            navigate('/properties');
        } catch (error) {
            setLoading(false);
            toast.error({ title: 'Error', description: 'An error occurred while adding the properties.' });
        }
    };

    return (
        <>
            <SEO
                title="Bulk Add Property - Equalify"
                description="Bulk add new propeties to Equalify to start monitoring and improving its accessibility."
                url="https://dashboard.equalify.app/properties/bulk"
            />
            <h1 id="bulk-property-heading" className="text-2xl font-bold md:text-3xl">
                Bulk Upload CSV
            </h1>

            <section
                aria-labelledby="bulk-property-heading"
                className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow"
                aria-live="polite"
            >
                <form onSubmit={handleSubmit} id="bulk-property-form" className='flex flex-col gap-4'>
                    <a target='_blank' className='underline' href='/template.csv'>Example Template CSV</a>
                    <input onChange={onChange} type='file' accept='.csv' />
                    {data.length > 0 && <div className='flex flex-col'>
                        <div>Showing first 10 rows</div>
                        {data.slice(0, 10).map((row, index) => <div key={index} className={`p-1 flex flex-row gap-2 ${index === 0 && 'bg-card'}`}>
                            {row.map((cell, index) => <div key={index} style={{ width: `${100 / data[0].length}%` }} className='truncate'>{cell}</div>)}
                        </div>)}
                        <div>...</div>
                    </div>}
                    <div className="space-x-6">
                        <Button
                            type='reset'
                            variant={'outline'}
                            className="w-fit"
                            onClick={() => navigate(-1)}
                            aria-label='Cancel adding property'
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="bulk-property-form"
                            className="w-fit bg-[#1D781D] text-white"
                            disabled={!isFormValid}
                            aria-disabled={!isFormValid}
                            aria-live="polite"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </section>
            {loading && <div
                className="fixed top-0 left-0 w-full h-full bg-[#6666] flex flex-row gap-2 items-center justify-center"
            >
                <div className='animate-spin flex flex-row items-center justify-center text-center'>↻</div>
                Adding {current} of {data.length - 1} properties...
            </div>}
        </>
    );
};

export default BulkProperty;
